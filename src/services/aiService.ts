/**
 * AI Service - Simple fetch-based API client with streaming and tool calling support
 * 
 * Uses native fetch API for maximum compatibility with Electron + Vite
 */

import { AI_CONFIG } from '../config/aiConfig'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | null
  tool_calls?: any[]
  tool_call_id?: string
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
  onToolCall?: (toolCall: { name: string; arguments: any }) => void
  onError?: (error: Error) => void
}

/**
 * Stream text completion from AI using native fetch with tool calling support
 * 
 * @param messages - Array of chat messages
 * @param tools - Optional array of tools for function calling
 * @param callbacks - Callbacks for streaming chunks, tool calls, and errors
 * @returns Promise with full response and any tool calls
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  tools?: Tool[],
  callbacks?: StreamCallbacks
): Promise<{ content: string; toolCalls: any[] }> {
  try {
    const requestBody: any = {
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: AI_CONFIG.systemPrompt },
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

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''
    let buffer = ''
    const toolCalls: any[] = []
    // Use map to track multiple tool calls separately by their index
    const pendingToolCalls = new Map<number, { id?: string; name: string; arguments: string }>()

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      // Process complete lines
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim()
        
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith(':')) continue
        
        // Skip [DONE] message
        if (trimmed === 'data: [DONE]') {
          // Finalize all pending tool calls
          pendingToolCalls.forEach((toolCall, index) => {
            if (toolCall.arguments) {
              try {
                console.log(`[AI Service] Parsing tool call index ${index}:`, toolCall.name)
                console.log(`[AI Service] Arguments:`, toolCall.arguments)
                const args = JSON.parse(toolCall.arguments)
                toolCalls.push({
                  name: toolCall.name,
                  arguments: args,
                })
                if (callbacks?.onToolCall) {
                  callbacks.onToolCall({ name: toolCall.name, arguments: args })
                }
                console.log(`[AI Service] Successfully parsed tool call ${index}:`, toolCall.name)
              } catch (e) {
                console.error(`[AI Service] Failed to parse tool call index ${index}:`, e)
                console.error(`[AI Service] Raw arguments:`, toolCall.arguments)
              }
            }
          })
          
          console.log('[AI Service] Stream completed, total length:', fullResponse.length, 'tool calls:', toolCalls.length)
          return { content: fullResponse, toolCalls }
        }
        
        // Parse SSE data
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            
            console.log('[AI Service] Parsed JSON:', json)
            
            const choice = json.choices?.[0]
            
            if (!choice) {
              console.log('[AI Service] No choice in this chunk')
              continue
            }

            // Handle content delta
            const content = choice.delta?.content || ''
            console.log('[AI Service] Content delta:', JSON.stringify(content))
            
            if (content) {
              fullResponse += content
              if (callbacks?.onChunk) {
                console.log('[AI Service] Calling onChunk with content:', content)
                callbacks.onChunk(content)
              }
            } else {
              console.log('[AI Service] No content in this choice')
            }

            // Handle tool calls delta
            const toolCallDelta = choice.delta?.tool_calls?.[0]
            if (toolCallDelta) {
              console.log('[AI Service] Tool call delta:', JSON.stringify(toolCallDelta, null, 2))
              
              if (toolCallDelta.index !== undefined) {
                // Get or create pending tool call for this index
                if (!pendingToolCalls.has(toolCallDelta.index)) {
                  pendingToolCalls.set(toolCallDelta.index, {
                    name: '',
                    arguments: '',
                  })
                }
                
                const toolCall = pendingToolCalls.get(toolCallDelta.index)!
                
                if (toolCallDelta.id && !toolCall.id) {
                  toolCall.id = toolCallDelta.id
                }
                
                if (toolCallDelta.function?.name) {
                  toolCall.name += toolCallDelta.function.name
                }
                
                if (toolCallDelta.function?.arguments) {
                  toolCall.arguments += toolCallDelta.function.arguments
                  console.log(`[AI Service] Accumulated arguments for index ${toolCallDelta.index}:`, toolCall.arguments)
                }
              }
            }
          } catch (e) {
            // Skip invalid JSON
            continue
          }
        }
      }
    }

    // Handle case where stream ends without [DONE]
    if (currentToolCall && currentToolCall.arguments) {
      try {
        const args = JSON.parse(currentToolCall.arguments)
        toolCalls.push({
          name: currentToolCall.name,
          arguments: args,
        })
        if (callbacks?.onToolCall) {
          callbacks.onToolCall({ name: currentToolCall.name, arguments: args })
        }
      } catch (e) {
        console.error('[AI Service] Failed to parse tool call arguments:', e)
      }
    }

    console.log('[AI Service] Stream completed, total length:', fullResponse.length, 'tool calls:', toolCalls.length)
    return { content: fullResponse, toolCalls }
  } catch (error) {
    console.error('[AI Service] Error in stream chat completion:', error)
    if (callbacks?.onError && error instanceof Error) {
      callbacks.onError(error)
    }
    throw error
  }
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
