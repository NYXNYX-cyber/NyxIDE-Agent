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
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '10px',
        marginBottom: '16px',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar - Right side for user, left side for AI */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isUser ? '#007acc' : '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <UserOutlined style={{ color: '#fff', fontSize: '18px' }} />
        ) : (
          <RobotOutlined style={{ color: '#fff', fontSize: '18px' }} />
        )}
      </div>

      {/* Message content */}
      <div
        style={{
          flex: 1,
          maxWidth: 'calc(100% - 50px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Timestamp above bubble */}
        <div
          style={{
            fontSize: '11px',
            color: '#999',
            marginBottom: '4px',
            padding: '0 4px',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        {/* Message bubble */}
        <div
          style={{
            backgroundColor: isUser ? '#007acc' : '#f3f4f6',
            color: isUser ? '#fff' : '#1a1a1a',
            padding: '12px 16px',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxWidth: '100%',
          }}
        >
          {message.content}
          {message.isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                backgroundColor: isUser ? '#fff' : '#007acc',
                marginLeft: '2px',
                animation: 'blink 1s infinite',
              }}
            />
          )}
        </div>

        {/* Actions below bubble */}
        {!isUser && message.content && !message.isStreaming && (
          <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                backgroundColor: copied ? '#10b981' : 'transparent',
                color: copied ? '#fff' : '#666',
                border: copied ? 'none' : '1px solid #d1d5db',
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
          </div>
        )}

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
              width: '100%',
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
