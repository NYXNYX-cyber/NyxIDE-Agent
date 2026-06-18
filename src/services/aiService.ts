/**
 * AI Service - OpenAI-compatible API client with streaming support
 * 
 * Uses Vercel AI SDK for type-safe AI interactions
 */

import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { AI_CONFIG } from '../config/aiConfig'

// Create OpenAI-compatible client with custom baseURL
export const ai = createOpenAI({
  baseURL: AI_CONFIG.baseURL,
  apiKey: AI_CONFIG.apiKey,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Get model instance
export const model = ai(AI_CONFIG.model)

/**
 * Stream text completion from AI
 * 
 * @param messages - Array of chat messages
 * @param onChunk - Callback for each streamed chunk
 * @param onError - Callback for errors
 * @returns Promise with full response
 */
export async function streamChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  onChunk?: (chunk: string) => void,
  onError?: (error: Error) => void
) {
  try {
    console.log('[AI Service] Starting stream chat completion...')
    
    const result = await streamText({
      model,
      messages: [
        { role: 'system', content: AI_CONFIG.systemPrompt },
        ...messages,
      ],
      maxTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    })

    // Collect full response while streaming
    let fullResponse = ''
    
    for await (const chunk of result.textStream) {
      fullResponse += chunk
      if (onChunk) {
        onChunk(chunk)
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
export async function chatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
) {
  try {
    console.log('[AI Service] Starting chat completion...')
    
    const result = await streamText({
      model,
      messages: [
        { role: 'system', content: AI_CONFIG.systemPrompt },
        ...messages,
      ],
      maxTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    })

    const fullResponse = await result.text
    console.log('[AI Service] Completion finished, length:', fullResponse.length)
    return fullResponse
  } catch (error) {
    console.error('[AI Service] Error in chat completion:', error)
    throw error
  }
}

// Export for convenience
export default {
  ai,
  model,
  streamChatCompletion,
  chatCompletion,
}
