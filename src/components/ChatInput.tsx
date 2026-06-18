import { useState, useRef, useEffect } from 'react'
import { SendOutlined } from '@ant-design/icons'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask me anything...',
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }, [inputValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || disabled) return

    onSend(inputValue.trim())
    setInputValue('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'AI is processing...' : placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '1.5',
            outline: 'none',
            backgroundColor: disabled ? '#f3f4f6' : '#fff',
            resize: 'none',
            fontFamily: 'inherit',
            minHeight: '42px',
            maxHeight: '120px',
          }}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          style={{
            padding: '10px 20px',
            backgroundColor:
              !inputValue.trim() || disabled ? '#d1d5db' : '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor:
              !inputValue.trim() || disabled ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '42px',
            transition: 'all 0.2s',
          }}
        >
          <SendOutlined />
          Send
        </button>
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#888',
          textAlign: 'center',
        }}
      >
        Press <kbd style={{ padding: '2px 6px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '10px' }}>Enter</kbd> to send, <kbd style={{ padding: '2px 6px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '10px' }}>Shift+Enter</kbd> for new line
      </div>
    </form>
  )
}
