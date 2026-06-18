import { useEffect, useRef } from 'react'
import { RobotOutlined, ClearOutlined } from '@ant-design/icons'
import { streamChatCompletion } from '../services/aiService'
import { useAIStore } from '../stores/aiStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default function ChatPanel() {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    addMessage,
    updateStreamingMessage,
    finalizeStreamingMessage,
    setLoading,
    setStreaming,
    setError,
    clearMessages,
  } = useAIStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content })

    // Prepare for AI response
    setLoading(true)
    setError(null)

    // Add placeholder assistant message for streaming and get its ID
    const assistantMessageId = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })

    setStreaming(true)

    try {
      console.log('[ChatPanel] Starting AI stream...')

      // Get recent messages for context (excluding the placeholder)
      const currentMessages = useAIStore.getState().messages
      const contextMessages = currentMessages
        .slice(0, -1) // Exclude the last placeholder message
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      // Add current user message to context
      contextMessages.push({ role: 'user', content })

      // Stream the response
      await streamChatCompletion(
        contextMessages,
        // On chunk callback
        (chunk) => {
          updateStreamingMessage(assistantMessageId, chunk)
        },
        // On error callback
        (error) => {
          console.error('[ChatPanel] Stream error:', error)
          setError(error.message)
        }
      )

      // Finalize streaming
      finalizeStreamingMessage(assistantMessageId)
      console.log('[ChatPanel] Stream completed')
    } catch (error) {
      console.error('[ChatPanel] Error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')

      // Update placeholder message with error
      updateStreamingMessage(assistantMessageId, '❌ Error connecting to AI service. Please try again.')
      finalizeStreamingMessage(assistantMessageId)
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  const handleClearChat = () => {
    if (messages.length === 0) return
    if (window.confirm('Clear all chat messages?')) {
      clearMessages()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingRight: '40px', // Space for close button
        }}
      >
        <RobotOutlined style={{ color: '#007acc', fontSize: '20px' }} />
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>
          NyxIDE Assistant
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#888' }}>
          {isStreaming ? '🔴 Streaming...' : messages.length > 0 ? `${messages.length} messages` : 'AI Ready'}
        </span>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Clear chat"
          >
            <ClearOutlined /> Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 && !isLoading && (
          <div
            style={{
              textAlign: 'center',
              color: '#888',
              marginTop: 'auto',
              marginBottom: 'auto',
              fontSize: '13px',
            }}
          >
            <p>Start a conversation with me!</p>
            <p>I'll help you with:</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '8px',
                textAlign: 'left',
              }}
            >
              <li>📝 Reading and editing files</li>
              <li>🔍 Searching your codebase</li>
              <li>💻 Executing bash commands</li>
              <li>🛠️ Managing project structure</li>
            </ul>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && !isStreaming && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#888',
              fontSize: '13px',
              padding: '12px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ddd',
                borderTop: '2px solid #007acc',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>AI is thinking...</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#c33',
              fontSize: '13px',
              marginTop: '8px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading || isStreaming}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
