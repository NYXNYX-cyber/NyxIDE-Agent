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
          placeholder="Ask me anything..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            padding: '12px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            lineHeight: '1.5',
            outline: 'none',
            backgroundColor: disabled ? '#f3f4f6' : '#fff',
            resize: 'none',
            fontFamily: 'inherit',
            minHeight: '40px',
            maxHeight: '100px',
          }}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          style={{
            width: '38px',
            height: '40px',
            padding: '0',
            backgroundColor: !inputValue.trim() || disabled ? '#d1d5db' : '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: !inputValue.trim() || disabled ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
            opacity: 0.9,
          }}
        >
          <SendOutlined />
        </button>
      </div>
    </form>
  )
}
