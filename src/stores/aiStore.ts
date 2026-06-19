/**
 * AI Store - Zustand store for chat state management with persistence
 * 
 * Features:
 * - Message history with persistence to localStorage
 * - Loading states and error handling
 * - Streaming message updates
 * - Context window management
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  reasoning?: string
  isStreaming?: boolean
}

interface AIState {
  messages: AIMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  
  // Actions
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => string
  updateStreamingMessage: (id: string, content: string) => void
  finalizeStreamingMessage: (id: string) => void
  setLoading: (loading: boolean) => void
  setStreaming: (streaming: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  removeMessage: (id: string) => void
  
  // Context helpers
  getRecentMessages: (limit?: number) => AIMessage[]
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isStreaming: false,
      error: null,
      
      addMessage: (message) => {
        const newMessage: AIMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }
        set((state) => ({
          messages: [...state.messages, newMessage],
          error: null,
        }))
        return newMessage.id // Return the generated ID
      },
      
      updateStreamingMessage: (id, content) => {
        console.log('[aiStore] updateStreamingMessage:')
        console.log('  - Target ID:', id)
        console.log('  - Content:', content)
        const currentState = get()
        const matchingMsg = currentState.messages.find(m => m.id === id)
        if (!matchingMsg) {
          console.warn('[aiStore] Message with ID not found!', id)
          return // Exit early if message not found
        }
        
        console.log('  - Found message:', matchingMsg.id)
        
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === id
              ? { ...msg, content: msg.content + content, isStreaming: true }
              : msg
          ),
        }))
      },
      
      finalizeStreamingMessage: (id) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === id
            ? { ...msg, isStreaming: false }
            : msg
        ),
        isStreaming: false,
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      
      setError: (error) => set({ error, isLoading: false, isStreaming: false }),
      
      clearMessages: () => set({ messages: [], error: null }),
      
      removeMessage: (id) => set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id),
      })),
      
      getRecentMessages: (limit = 20) => {
        const messages = get().messages
        return messages.slice(-limit)
      },
    }),
    {
      name: 'nyxide-ai-chat', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages, // Only persist messages, not loading states
      }),
    }
  )
)

export default useAIStore
