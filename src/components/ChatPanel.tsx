import { useState, useRef, useEffect } from 'react'
import { SendOutlined, RobotOutlined } from '@ant-design/icons'

export default function ChatPanel() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; reasoning?: string }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // TODO: Week 2 - Implement actual AI API call
      // For now, use mock response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Hello! I\'m NyxIDE AI Assistant. This feature will be implemented in Week 2 when we integrate the AI API.\n\nIn the meantime, you can explore the file explorer on the right side.',
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('API Error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error connecting to AI service.' }
      ])
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      backgroundColor: '#ffffff',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <RobotOutlined style={{ color: '#007acc', fontSize: '20px' }} />
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>NyxIDE Assistant</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#888' }}>Week 2: AI Integration</span>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#888', 
            marginTop: 'auto', 
            marginBottom: 'auto',
            fontSize: '13px',
          }}>
            <p>Start a conversation with me!</p>
            <p>I'll help you with:</p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px', textAlign: 'left' }}>
              <li>📝 Reading and editing files</li>
              <li>🔍 Searching your codebase</li>
              <li>💻 Executing bash commands</li>
              <li>🛠️ Managing project structure</li>
            </ul>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              backgroundColor: msg.role === 'user' ? '#007acc' : '#f3f4f6',
              color: msg.role === 'user' ? '#fff' : '#1a1a1a',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '85%',
              whiteSpace: 'pre-wrap',
              fontSize: '13px',
              lineHeight: '1.5',
            }}>
              {msg.content}
            </div>
            {/* Reasoning content placeholder (Week 2 feature) */}
            {msg.reasoning && (
              <details style={{ maxWidth: '85%', fontSize: '12px', color: '#666' }}>
                <summary style={{ cursor: 'pointer', padding: '4px 0' }}>Thinking process...</summary>
                <div style={{ padding: '8px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
                  {msg.reasoning}
                </div>
              </details>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '13px' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid #ddd', borderTop: '2px solid #007acc', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span>AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isLoading ? 'AI is processing...' : 'Ask me anything...'}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            backgroundColor: '#fff',
          }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: !inputValue.trim() || isLoading ? '#d1d5db' : '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <SendOutlined />
          Send
        </button>
      </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
