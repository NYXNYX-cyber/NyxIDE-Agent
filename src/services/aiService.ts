/**
 * AI Service - Simple fetch-based API client with streaming support
 * 
 * Uses native fetch API for maximum compatibility with Electron + Vite
 */

import { AI_CONFIG } from '../config/aiConfig'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Stream text completion from AI using native fetch
 * 
 * @param messages - Array of chat messages
 * @param onChunk - Callback for each streamed chunk
 * @param onError - Callback for errors
 * @returns Promise with full response
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  onError?: (error: Error) => void
): Promise<string> {
  try {
    console.log('[AI Service] Starting stream chat completion...')
    
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
        stream: true,
      }),
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
          console.log('[AI Service] Stream completed, total length:', fullResponse.length)
          return fullResponse
        }
        
        // Parse SSE data
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            const content = json.choices?.[0]?.delta?.content || ''
            
            if (content) {
              fullResponse += content
              if (onChunk) {
                onChunk(content)
              }
            }
          } catch (e) {
            // Skip invalid JSON
            continue
          }
        }
      }
    }

    console.log('[AI Service] Stream completed, total length:', fullResponse.length)
    return fullResponse
  } catch (error) {
    console.error('[AI Service] Error in stream chat completion:', error)
    if (onError && error instanceof Error) {
      onError(error)
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
