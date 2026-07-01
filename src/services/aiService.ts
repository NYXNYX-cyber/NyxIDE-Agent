/**
 * AI Service - Simple fetch-based API client with streaming and tool calling support
 * 
 * Uses native fetch API for maximum compatibility with Electron + Vite
 * In Electron: routes through IPC to bypass CORS
 */

import { AI_CONFIG } from '../config/aiConfig'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  name?: string
  content: string | null
  tool_calls?: any[]
  tool_call_id?: string
  toolExecutionStatus?: 'pending' | 'running' | 'completed' | 'failed' | 'rejected'
  toolOutput?: string
}

interface Tool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: any
  }
}

interface StreamCallbacks {
  onChunk?: (chunk: string) => void
  onToolCall?: (toolCall: { id?: string; name: string; arguments: any }) => void
  onError?: (error: Error) => void
}

interface StreamOptions {
  model?: string
  workingDir?: string
}

// Detect if running in Electron
const isElectron = typeof window !== 'undefined' && (window as any).nyxide !== undefined

/**
 * Process SSE stream from chunks
 */
async function processSSEStream(
  chunks: AsyncIterable<string> | string,
  callbacks?: StreamCallbacks
): Promise<{ content: string; toolCalls: any[] }> {
  let fullResponse = ''
  let buffer = ''
  const toolCalls: any[] = []
  const pendingToolCalls = new Map<number, { id?: string; name: string; arguments: string }>()

  const processLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith(':')) return null
    if (trimmed === 'data: [DONE]') {
      pendingToolCalls.forEach((toolCall, index) => {
        if (toolCall.arguments) {
          try {
            const args = JSON.parse(toolCall.arguments)
            toolCalls.push({ id: toolCall.id, name: toolCall.name, arguments: args })
            if (callbacks?.onToolCall) {
              callbacks.onToolCall({ id: toolCall.id, name: toolCall.name, arguments: args })
            }
          } catch (e) {
            console.error(`[AI Service] Failed to parse tool call ${index}:`, e)
          }
        }
      })
      return 'DONE'
    }
    if (trimmed.startsWith('data: ')) {
      try {
        const json = JSON.parse(trimmed.slice(6))
        const choice = json.choices?.[0]
        if (!choice) return null
        const content = choice.delta?.content || ''
        if (content) {
          fullResponse += content
          if (callbacks?.onChunk) callbacks.onChunk(content)
        }
        const toolCallDelta = choice.delta?.tool_calls?.[0]
        if (toolCallDelta && toolCallDelta.index !== undefined) {
          if (!pendingToolCalls.has(toolCallDelta.index)) {
            pendingToolCalls.set(toolCallDelta.index, { name: '', arguments: '' })
          }
          const tc = pendingToolCalls.get(toolCallDelta.index)!
          if (toolCallDelta.id && !tc.id) tc.id = toolCallDelta.id
          if (toolCallDelta.function?.name) tc.name += toolCallDelta.function.name
          if (toolCallDelta.function?.arguments) tc.arguments += toolCallDelta.function.arguments
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
    return null
  }

  if (typeof chunks === 'string') {
    // Process as single string
    const lines = chunks.split('\n')
    for (const line of lines) {
      if (processLine(line) === 'DONE') break
    }
  } else {
    // Process as async iterable
    for await (const chunk of chunks) {
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (processLine(line) === 'DONE') break
      }
    }
  }

  return { content: fullResponse, toolCalls }
}

/**
 * Stream text completion from AI using native fetch with tool calling support
 * 
 * @param messages - Array of chat messages
 * @param tools - Optional array of tools for function calling
 * @param callbacks - Callbacks for streaming chunks, tool calls, and errors
 * @param options - Optional settings (model override, working directory)
 * @returns Promise with full response and any tool calls
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  tools?: Tool[],
  callbacks?: StreamCallbacks,
  options?: StreamOptions
): Promise<{ content: string; toolCalls: any[] }> {
  try {
    const selectedModel = options?.model || AI_CONFIG.model
    const systemPrompt = AI_CONFIG.getSystemPrompt(options?.workingDir)
    
    const requestBody: any = {
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      stream: true,
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      requestBody.tools = tools
      requestBody.tool_choice = 'auto'
    }

    // Use IPC in Electron (bypass CORS)
    if (isElectron) {
      console.log('[AI Service] Using Electron IPC for AI request')
      return await streamViaIPC(requestBody, callbacks)
    }

    // Use direct fetch in browser
    console.log('[AI Service] Using fetch for AI request to:', AI_CONFIG.baseURL)
    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    return await processSSEStream(response.body, callbacks)
  } catch (error) {
    console.error('[AI Service] Error in stream chat completion:', error)
    if (callbacks?.onError && error instanceof Error) {
      callbacks.onError(error)
    }
    throw error
  }
}

/**
 * Stream via Electron IPC (bypasses CORS)
 */
async function streamViaIPC(
  requestBody: any,
  callbacks?: StreamCallbacks
): Promise<{ content: string; toolCalls: any[] }> {
  return new Promise((resolve, reject) => {
    let fullStream = ''
    let streamEnded = false

    // Setup listeners
    const cleanup = () => {
      if ((window as any).nyxide?.onAIStreamChunk) {
        // Note: We can't easily remove contextBridge listeners
        // They'll be GC'd when no longer referenced
      }
    }

    // Override the chunk callback to accumulate stream
    const wrappedCallbacks: StreamCallbacks = {
      ...callbacks,
      onChunk: (chunk) => {
        fullStream += chunk
        if (callbacks?.onChunk) callbacks.onChunk(chunk)
      }
    }

    // Listen for stream chunks
    if ((window as any).nyxide?.onAIStreamChunk) {
      (window as any).nyxide.onAIStreamChunk((chunk: string) => {
        wrappedCallbacks.onChunk?.(chunk)
      })
    }

    // Listen for stream end
    if ((window as any).nyxide?.onAIStreamEnd) {
      (window as any).nyxide.onAIStreamEnd(() => {
        if (streamEnded) return
        streamEnded = true
        // Process accumulated stream
        processSSEStream(fullStream, callbacks).then(resolve).catch(reject)
      })
    }

    // Listen for errors
    if ((window as any).nyxide?.onAIStreamError) {
      (window as any).nyxide.onAIStreamError((error: string) => {
        if (streamEnded) return
        streamEnded = true
        const err = new Error(error)
        if (callbacks?.onError) callbacks.onError(err)
        reject(err)
      })
    }

    // Trigger the IPC call
    ;(window as any).nyxide?.aiChatStream(requestBody).then((result: any) => {
      if (!result.success) {
        streamEnded = true
        const err = new Error(result.error || 'AI request failed')
        if (callbacks?.onError) callbacks.onError(err)
        reject(err)
      }
    }).catch((err: Error) => {
      streamEnded = true
      if (callbacks?.onError) callbacks.onError(err)
      reject(err)
    })
  })
}

/**
 * Simple non-streaming chat completion (for quick requests)
 */
export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    console.log('[AI Service] Starting chat completion...')
    
    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: AI_CONFIG.systemPrompt },
          ...messages,
        ],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    console.log('[AI Service] Completion finished, length:', content.length)
    return content
  } catch (error) {
    console.error('[AI Service] Error in chat completion:', error)
    throw error
  }
}

// Export for convenience
export default {
  streamChatCompletion,
  chatCompletion,
}
