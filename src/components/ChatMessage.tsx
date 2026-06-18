import { RobotOutlined, UserOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { AIMessage } from '../stores/aiStore'

interface ChatMessageProps {
  message: AIMessage
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        backgroundColor: isUser ? '#f0f7ff' : '#ffffff',
        borderRadius: '8px',
        border: `1px solid ${isUser ? '#d0e7ff' : '#e5e7eb'}`,
        marginBottom: '12px',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: isUser ? '#007acc' : '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <UserOutlined style={{ color: '#fff', fontSize: '16px' }} />
        ) : (
          <RobotOutlined style={{ color: '#fff', fontSize: '16px' }} />
        )}
      </div>

      {/* Message content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a1a' }}>
            {isUser ? 'You' : 'NyxIDE Assistant'}
          </span>
          <span style={{ fontSize: '11px', color: '#888' }}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Message text */}
        <div
          style={{
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#1a1a1a',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
          {message.isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                backgroundColor: '#007acc',
                marginLeft: '2px',
                animation: 'blink 1s infinite',
              }}
            />
          )}
        </div>

        {/* Reasoning/thinking process */}
        {message.reasoning && (
          <details
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#666',
              backgroundColor: '#fafafa',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
              💭 Thinking process
            </summary>
            <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
              {message.reasoning}
            </div>
          </details>
        )}

        {/* Copy button for assistant messages */}
        {!isUser && message.content && !message.isStreaming && (
          <button
            onClick={handleCopy}
            style={{
              marginTop: '8px',
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: copied ? '#10b981' : '#f3f4f6',
              color: copied ? '#fff' : '#666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            {copied ? (
              <>
                <CheckOutlined /> Copied!
              </>
            ) : (
              <>
                <CopyOutlined /> Copy
              </>
            )}
          </button>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
