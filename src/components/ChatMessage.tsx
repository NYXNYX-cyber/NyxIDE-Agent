import { RobotOutlined, UserOutlined, CopyOutlined, CheckOutlined, SettingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { AIMessage } from '../stores/aiStore'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: AIMessage
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isTool = message.role === 'tool'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
        marginBottom: '16px',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid #000',
          backgroundColor: isUser ? '#d8a000' : isTool ? '#e6f7ff' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {isUser ? <UserOutlined /> : isTool ? <SettingOutlined /> : <RobotOutlined />}
      </div>

      {/* Bubble */}
      <div
        style={{
          flex: 1,
          border: '2px solid #000',
          backgroundColor: isUser ? '#fff' : isTool ? '#fafafa' : '#f5f5f5',
          padding: '12px',
          position: 'relative',
          boxShadow: '4px 4px 0 #000',
          maxWidth: '85%',
        }}
      >
        {/* Header/Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#666',
            borderBottom: '1px solid #eee',
            paddingBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          <span>
            {isUser ? 'YOU' : isTool ? 'SYSTEM (TOOL RESULT)' : message.model ? `ASSISTANT (${message.model.split('/').pop()})` : 'ASSISTANT'}
          </span>
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Copy Button */}
        {message.content && (
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '12px',
              zIndex: 5,
            }}
            title="Copy message"
          >
            {copied ? <CheckOutlined style={{ color: 'green' }} /> : <CopyOutlined />}
          </button>
        )}

        {/* Message Content */}
        {isTool && (
          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#555', fontStyle: 'italic', marginBottom: '8px' }}>
            ⚙️ Tool execution completed. Result sent to assistant.
          </div>
        )}

        {message.content && (
          <div style={{ fontSize: '13px', lineHeight: '1.6', wordBreak: 'break-word' }}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
