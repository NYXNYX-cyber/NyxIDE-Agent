import { useEffect, useRef, useState } from 'react'
import { RobotOutlined, ClearOutlined } from '@ant-design/icons'
import { streamChatCompletion, type ChatMessage as AIMessage } from '../services/aiService'
import { useAIStore } from '../stores/aiStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { type Tool } from '../types/tool'
import { readFile, writeFile, createFile, deleteFile, listDirectory } from '../tools/fileTools'
import { AVAILABLE_MODELS } from '../config/aiConfig'

// Define file tools schema for AI
const FILE_TOOLS: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'readFile',
      description: 'Read the content of a file at the specified path.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to read' },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'writeFile',
      description: 'Write new content to an existing file with diff preview.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to write to' },
          content: { type: 'string', description: 'New content to write' },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createFile',
      description: 'Create a new file at the specified path with optional initial content.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to create' },
          content: { type: 'string', description: 'Initial content (optional)' },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deleteFile',
      description: 'Delete a file at the specified path. This action cannot be undone.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to delete' },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listDirectory',
      description: 'List all files and folders in a directory.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute directory path to list' },
        },
        required: ['path'],
      },
    },
  },
]

interface ChatPanelProps {
  currentFolder?: string
}

export default function ChatPanel({ currentFolder }: ChatPanelProps) {
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
  const [pendingToolCall, setPendingToolCall] = useState<{ name: string; args: any } | null>(null)
  const isToolExecutingRef = useRef(false)
  
  // Model selection with localStorage persistence
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('nyxide-selected-model') || 'cx/gpt-5.5'
  })

  // Save selected model to localStorage when changed
  useEffect(() => {
    localStorage.setItem('nyxide-selected-model', selectedModel)
  }, [selectedModel])

  // Debug: Log working directory
  useEffect(() => {
    console.log('[ChatPanel] Working directory:', currentFolder)
  }, [currentFolder])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Execute tool function based on tool name
  const executeTool = async (toolName: string, args: any): Promise<string> => {
    console.log('[ChatPanel] Executing tool:', toolName, args)
    
    // Show loading message
    const loadingMessageId = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })
    setPendingToolCall({ name: `${toolName}...`, args })
    
    try {
      switch (toolName) {
        case 'readFile': {
          const result = await readFile.execute(args)
          if (!result.success) {
            finalizeStreamingMessage(loadingMessageId)
            return `❌ Error reading file: ${result.error}`
          }
          finalizeStreamingMessage(loadingMessageId)
          return `📄 **File Content:** ${result.path}\n\`\`\`\n${result.content}\n\`\`\`\n(${result.lineCount} lines)`
        }
        
        case 'writeFile': {
          const result = await writeFile.execute(args)
          finalizeStreamingMessage(loadingMessageId)
          
          // Refresh editor tab if file is open, and refresh file explorer tree
          if (result.success) {
            if ((window as any).nyxideRefreshTab) {
              await (window as any).nyxideRefreshTab(result.path)
            }
            if ((window as any).fileExplorerRefresh) {
              (window as any).fileExplorerRefresh()
            }
          }
          
          if (result.success && result.needsApproval) {
            return `📝 **File Modified:** ${result.path}\nChanges ready to apply. Review diff below.`
          }
          return result.success 
            ? `✅ File written successfully: ${result.path}`
            : `❌ Error writing file: ${result.error}`
        }
        
        case 'createFile': {
          const result = await createFile.execute(args)
          finalizeStreamingMessage(loadingMessageId)
          
          // Refresh file explorer tree to show new file
          if (result.success && (window as any).fileExplorerRefresh) {
            (window as any).fileExplorerRefresh()
          }
          
          return result.success 
            ? `✅ **File Created:** ${result.path} (${result.lineCount} lines)`
            : `❌ Error creating file: ${result.error}`
        }
        
        case 'deleteFile': {
          const result = await deleteFile.execute(args)
          finalizeStreamingMessage(loadingMessageId)
          
          // Refresh file explorer tree to reflect deletion
          if (result.success && (window as any).fileExplorerRefresh) {
            (window as any).fileExplorerRefresh()
          }
          
          return result.success 
            ? `🗑️ **File Deleted:** ${result.path}`
            : `❌ Error deleting file: ${result.error}`
        }
        
        case 'listDirectory': {
          const result = await listDirectory.execute(args)
          if (!result.success) {
            finalizeStreamingMessage(loadingMessageId)
            return `❌ Error listing directory: ${result.error}`
          }
          
          finalizeStreamingMessage(loadingMessageId)
          
          const items = result.items || []
          if (items.length === 0) return `📁 **Empty directory:** ${result.path}`
          
          const list = items.map((item: any) => 
            item.isDirectory ? `📁 ${item.name}/` : `📄 ${item.name}`
          ).join('\n')
          
          return `📁 **Directory:** ${result.path}\n${list}\n\n(${result.count} items)`
        }
        
        default:
          finalizeStreamingMessage(loadingMessageId)
          return `⚠️ Unknown tool: ${toolName}`
      }
    } catch (error: any) {
      console.error('[ChatPanel] Tool execution error:', error)
      finalizeStreamingMessage(loadingMessageId)
      return `❌ Error executing ${toolName}: ${error.message}`
    } finally {
      setPendingToolCall(null)
    }
  }

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content })

    // Prepare for AI response
    setLoading(true)
    setError(null)
    setPendingToolCall(null)

    // Add placeholder assistant message for streaming and get its ID
    const assistantMessageId = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })
    
    // Wait for state to update (zustand async)
    await new Promise(resolve => setTimeout(resolve, 50))

    setStreaming(true)

    try {
      // Get recent messages for context (excluding the placeholder)
      const currentMessages = useAIStore.getState().messages
      const contextMessages = currentMessages
        .slice(0, -1) // Exclude the last placeholder message
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content || '' }))

      // Add current user message with working directory context
      const userMessageWithContext = currentFolder 
        ? `[Working Directory: ${currentFolder}]\n\n${content}`
        : content
      
      contextMessages.push({ role: 'user', content: userMessageWithContext })

      // Stream the response with tool definitions
      const result = await streamChatCompletion(
        contextMessages as AIMessage[],
        FILE_TOOLS, // Pass tools to AI
        // On chunk callback
        (chunk) => {
          updateStreamingMessage(assistantMessageId, chunk)
        },
        // On error callback
        (err) => {
          console.error('[ChatPanel] Stream error:', err)
          setError(err.message)
        },
        // Stream options: model and working directory
        {
          model: selectedModel,
          workingDir: currentFolder,
        }
      )
      
      // If streaming didn't update via chunks, update directly from result
      if (result.content && result.content.length > 0) {
        const currentMsg = useAIStore.getState().messages.find(m => m.id === assistantMessageId)
        if (currentMsg && currentMsg.content === '') {
          console.log('[ChatPanel] Fallback: updating message from result.content')
          updateStreamingMessage(assistantMessageId, result.content)
        }
      }
      
      // Wait for streaming to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Only show fallback if content is empty AND no tool calls
      const hasToolCalls = result.toolCalls && result.toolCalls.length > 0
      const finalMsg = useAIStore.getState().messages.find(m => m.id === assistantMessageId)
      if (finalMsg && finalMsg.content.trim() === '' && !hasToolCalls) {
        console.warn('[ChatPanel] Empty response detected without tool calls, adding fallback')
        updateStreamingMessage(assistantMessageId, '❌ AI tidak memberikan respons. Silakan coba lagi atau ubah model.')
      }

      // Handle tool calls if any
      if (result.toolCalls && result.toolCalls.length > 0) {
        console.log('[ChatPanel] Tool calls detected:', result.toolCalls)
        
        const toolResults: string[] = []
        let hasErrors = false
        
        for (const toolCall of result.toolCalls) {
          setPendingToolCall({ name: `${toolCall.name}...`, args: toolCall.arguments })
          
          // Show only the operation, not full details upfront
          const action = toolCall.name === 'readFile' ? '📖 Reading' :
                         toolCall.name === 'writeFile' ? '✏️ Writing' :
                         toolCall.name === 'createFile' ? '✨ Creating' :
                         toolCall.name === 'deleteFile' ? '🗑️ Deleting' :
                         toolCall.name === 'listDirectory' ? '📁 Listing' : '⚙️ Processing'
          
          const targetPath = (toolCall.arguments as any).path || 'unknown'
          addMessage({
            role: 'assistant',
            content: `**${action}:** ${targetPath.split('/').pop()}`
          })

          // Execute the tool
          const toolResult = await executeTool(toolCall.name, toolCall.arguments)
          toolResults.push(toolResult)
          
          // Check if operation succeeded or failed
          if (toolResult.includes('❌') || toolResult.includes('Error')) {
            hasErrors = true
          }
          
          // Show detailed result
          addMessage({
            role: 'assistant',
            content: toolResult,
          })
        }
        
        // After all tool calls complete, show completion summary
        if (toolResults.length > 0) {
          const successCount = toolResults.filter(r => !r.includes('❌')).length
          const totalTasks = toolResults.length
          
          let completionMessage = ''
          if (hasErrors) {
            completionMessage = `\n\n⚠️ **Task Selesai:** ${successCount}/${totalTasks} berhasil, beberapa ada error`
          } else {
            completionMessage = `\n\n✅ **Task Selesai!** Semua ${totalTasks} operasi berhasil dikerjakan.`
          }
          
          addMessage({
            role: 'assistant',
            content: completionMessage,
          })
          
          // Auto-refresh UI after task completion
          await new Promise(resolve => setTimeout(resolve, 300))
          if ((window as any).fileExplorerRefresh) {
            (window as any).fileExplorerRefresh()
          }
        }
      }

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
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '40px', // Space for close button
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {/* Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>
            Model:
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isStreaming}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: isStreaming ? '#f3f4f6' : '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              color: '#1a1a1a',
            }}
            title={AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description || 'Select AI model'}
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Working Directory Indicator */}
        {currentFolder && (
          <div style={{ fontSize: '10px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📁 {currentFolder}
          </div>
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
            <p>I can help you with:</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '8px',
                textAlign: 'left',
              }}
            >
              <li>📝 Read and edit files</li>
              <li>🔍 Create new files</li>
              <li>🗑️ Delete files</li>
              <li>📁 Browse directories</li>
            </ul>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage key={msg.id} message={msg} />
            
            {/* Show tool call info for assistant messages */}
            {msg.role === 'assistant' && msg.content?.includes('🔧 AI wants to execute') && renderToolCallInfo()}
          </div>
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
