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
  onClose?: () => void
}

export default function ChatPanel({ currentFolder, onClose }: ChatPanelProps) {
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
          padding: '16px',
          borderBottom: '3px solid #000',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 900,
              border: '3px solid #000',
            }}
          >
            N
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: '16px', color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              NyxIDE Assistant
            </div>
            <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isStreaming ? '● STREAMING...' : isLoading ? '● LOADING...' : messages.length > 0 ? `${messages.length} MESSAGES` : '○ READY'}
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="brutalist-button"
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #000',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              title="Clear chat"
            >
              <ClearOutlined /> Clear
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#fff',
                color: '#000',
                border: '2px solid #000',
                boxShadow: '2px 2px 0 #000',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 900,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(1px, 1px)'
                e.currentTarget.style.boxShadow = '1px 1px 0 #000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '2px 2px 0 #000'
              }}
              title="Close panel"
            >
              ✕
            </button>
          )}
        </div>

        {/* Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#000', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Model:
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isStreaming}
            className="brutalist-input"
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: isStreaming ? '#f5f5f5' : '#fff',
              border: '2px solid #000',
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              color: '#000',
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
          <div
            style={{
              padding: '6px 10px',
              fontSize: '10px',
              color: '#000',
              backgroundColor: '#f5f5f5',
              border: '2px solid #000',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📁</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentFolder}
            </span>
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
          gap: '12px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.length === 0 && !isLoading && (
          <div
            style={{
              textAlign: 'center',
              color: '#000',
              marginTop: 'auto',
              marginBottom: 'auto',
              padding: '24px',
              border: '3px dashed #000',
              backgroundColor: '#fff',
            }}
          >
            <p style={{ fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Start a conversation!
            </p>
            <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
              I can help you with:
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              <div style={{ padding: '6px 10px', border: '2px solid #000', backgroundColor: '#fff' }}>📝 Read & edit files</div>
              <div style={{ padding: '6px 10px', border: '2px solid #000', backgroundColor: '#fff' }}>✨ Create new files</div>
              <div style={{ padding: '6px 10px', border: '2px solid #000', backgroundColor: '#fff' }}>🗑️ Delete files</div>
              <div style={{ padding: '6px 10px', border: '2px solid #000', backgroundColor: '#fff' }}>📁 Browse directories</div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              padding: '12px',
              border: '2px solid #000',
              boxShadow: '4px 4px 0 #000',
              backgroundColor: msg.role === 'user' ? '#fff' : msg.role === 'tool' ? '#fafafa' : '#f5f5f5',
              transform: msg.role === 'user' ? 'translate(-2px, -2px)' : 'none',
            }}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#666',
              borderBottom: '1px solid #eee',
              paddingBottom: '4px'
            }}>
              <span>{msg.role === 'user' ? 'YOU' : msg.role === 'tool' ? 'SYSTEM' : 'NYXIDE ASSISTANT'}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Body */}
            {msg.role === 'tool' && (
              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#555', fontStyle: 'italic' }}>
                ⚙️ Tool execution completed. Result sent to assistant.
              </div>
            )}

            {msg.role !== 'tool' && msg.content && (
              <div style={{ wordBreak: 'break-word', fontSize: '13px' }}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}

            {/* Tool Calls Rendering */}
            {msg.tool_calls && msg.tool_calls.length > 0 && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                border: '2px solid #000',
                backgroundColor: '#fff',
                fontFamily: 'Courier New, monospace',
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚙️</span>
                  <span>Tool Action Required</span>
                </div>
                {msg.tool_calls.map((tc, idx) => {
                  let cmd = '';
                  let isCommand = tc.function.name === 'run_terminal_command';
                  try {
                    const args = typeof tc.function.arguments === 'string'
                      ? JSON.parse(tc.function.arguments)
                      : tc.function.arguments;
                    cmd = isCommand ? args.command : (tc.function.name + ': ' + (args.path || ''));
                  } catch (e) {
                    cmd = tc.function.arguments || '';
                  }
                  
                  return (
                    <div key={idx}>
                      <div style={{
                        backgroundColor: '#1e1e1e',
                        color: '#a9ff68',
                        padding: '8px',
                        fontSize: '12px',
                        borderRadius: '2px',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        marginBottom: '10px',
                        border: '1px solid #000'
                      }}>
                        {isCommand ? '$ ' : ''}{cmd}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                          Status:{' '}
                          <span style={{ 
                            color: 
                              msg.toolExecutionStatus === 'pending' ? '#d8a000' :
                              msg.toolExecutionStatus === 'running' ? '#0066cc' :
                              msg.toolExecutionStatus === 'completed' ? '#00aa00' :
                              msg.toolExecutionStatus === 'failed' ? '#cc0000' : '#888'
                          }}>
                            {(msg.toolExecutionStatus || 'pending').toUpperCase()}
                          </span>
                        </div>
                        
                        {msg.toolExecutionStatus === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleCancelTool(msg.id)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                backgroundColor: '#ffcccc',
                                color: '#000',
                                border: '2px solid #000',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ✕ Cancel
                            </button>
                            <button
                              onClick={() => handleRunTool(msg.id)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                backgroundColor: '#ccffcc',
                                color: '#000',
                                border: '2px solid #000',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ✓ Run Action
                            </button>
                          </div>
                        )}
                      </div>

                      {msg.toolOutput && (
                        <details style={{ marginTop: '10px' }}>
                          <summary style={{ fontSize: '11px', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                            Show action output
                          </summary>
                          <pre style={{
                            marginTop: '6px',
                            padding: '8px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ccc',
                            fontSize: '11px',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                          }}>
                            {msg.toolOutput}
                          </pre>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {isLoading && !isStreaming && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 #000',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #fff',
                borderTop: '2px solid #000',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>AI is thinking...</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#000',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 #000',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
