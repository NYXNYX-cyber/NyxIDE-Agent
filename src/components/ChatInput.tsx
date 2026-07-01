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
        borderTop: '3px solid #000',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ASK ME ANYTHING..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            padding: '12px 14px',
            border: '3px solid #000',
            boxShadow: disabled ? 'none' : '4px 4px 0 #000',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '1.5',
            outline: 'none',
            backgroundColor: disabled ? '#f5f5f5' : '#fff',
            resize: 'none',
            fontFamily: 'inherit',
            minHeight: '44px',
            maxHeight: '120px',
            color: '#000',
            transition: 'all 0.15s ease',
            borderRadius: 0,
          }}
          onFocus={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)'
            e.currentTarget.style.boxShadow = '6px 6px 0 #000'
          }}
          onBlur={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '4px 4px 0 #000'
          }}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          style={{
            width: '52px',
            height: '44px',
            padding: '0',
            backgroundColor: !inputValue.trim() || disabled ? '#f5f5f5' : '#000',
            color: !inputValue.trim() || disabled ? '#999' : '#fff',
            border: '3px solid #000',
            boxShadow: !inputValue.trim() || disabled ? 'none' : '4px 4px 0 #000',
            cursor: !inputValue.trim() || disabled ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 900,
            transition: 'all 0.15s ease',
            borderRadius: 0,
          }}
          onMouseEnter={(e) => {
            if (!(!inputValue.trim() || disabled)) {
              e.currentTarget.style.transform = 'translate(2px, 2px)'
              e.currentTarget.style.boxShadow = '2px 2px 0 #000'
            }
          }}
          onMouseLeave={(e) => {
            if (!(!inputValue.trim() || disabled)) {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '4px 4px 0 #000'
            }
          }}
          onMouseDown={(e) => {
            if (!(!inputValue.trim() || disabled)) {
              e.currentTarget.style.transform = 'translate(4px, 4px)'
              e.currentTarget.style.boxShadow = '0px 0px 0 #000'
            }
          }}
          onMouseUp={(e) => {
            if (!(!inputValue.trim() || disabled)) {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '4px 4px 0 #000'
            }
          }}
        >
          <SendOutlined />
        </button>
      </div>
    </form>
  )
}
