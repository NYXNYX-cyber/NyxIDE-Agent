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
        marginBottom: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar - Right side for user, left side for AI */}
      <div
        style={{
          width: '36px',
          height: '36px',
          backgroundColor: isUser ? '#fff' : '#000',
          color: isUser ? '#000' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '3px solid #000',
          fontWeight: 900,
          fontSize: '16px',
        }}
      >
        {isUser ? (
          <UserOutlined style={{ fontSize: '16px' }} />
        ) : (
          <RobotOutlined style={{ fontSize: '16px' }} />
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
            fontSize: '10px',
            color: '#000',
            marginBottom: '4px',
            padding: '0 4px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
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
            backgroundColor: isUser ? '#000' : '#fff',
            color: isUser ? '#fff' : '#000',
            padding: '12px 16px',
            border: '3px solid #000',
            boxShadow: isUser ? 'none' : '4px 4px 0 #000',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '1.6',
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
                height: '14px',
                backgroundColor: isUser ? '#fff' : '#000',
                marginLeft: '4px',
                animation: 'blink 1s infinite',
                verticalAlign: 'middle',
              }}
            />
          )}
        </div>

        {/* Actions below bubble */}
        {!isUser && message.content && !message.isStreaming && (
          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <button
              onClick={handleCopy}
              className="brutalist-button"
              style={{
                padding: '4px 10px',
                fontSize: '10px',
                backgroundColor: copied ? '#000' : '#fff',
                color: copied ? '#fff' : '#000',
                border: '2px solid #000',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {copied ? (
                <>
                  <CheckOutlined /> Copied
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
              color: '#000',
              backgroundColor: '#fff',
              padding: '8px 12px',
              border: '2px solid #000',
              width: '100%',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
