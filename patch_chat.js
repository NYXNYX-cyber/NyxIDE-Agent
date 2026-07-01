const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ChatPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace ChatMessage interface
const oldInterface = `interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string | null
  timestamp: number
  model?: string
  tokens?: number
}`;

const newInterface = `interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  name?: string
  content: string | null
  timestamp: number
  model?: string
  tokens?: number
  tool_calls?: any[]
  tool_call_id?: string
  toolExecutionStatus?: 'pending' | 'running' | 'completed' | 'failed' | 'rejected'
  toolOutput?: string
}`;

// Normalize line endings for replacement
const normalize = str => str.replace(/\r\n/g, '\n').trim();
if (normalize(content).includes(normalize(oldInterface))) {
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(oldInterface.replace(/\r\n/g, '\n'), newInterface.replace(/\r\n/g, '\n'));
  console.log('Successfully replaced ChatMessage interface');
} else {
  console.log('ChatMessage interface already replaced or not found');
}

// 2. Replace handleSendMessage with the conversation flow and tool execution methods
const oldHandleSendMessage = `  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsGenerating(true)
    setReasoning('')

    try {
      const activeModel = settingsOpen ? settings.model : AI_CONFIG.model
      
      const apiMessages = [
        ...messages.map(({ role, content }) => ({ role, content })),
        userMsg
      ]

      // Create placeholder message for stream
      const assistantMsgId = Math.random().toString(36).substring(7)
      
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          model: activeModel,
        },
      ])

      const result = await streamChatCompletion(
        apiMessages,
        undefined,
        {
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: (msg.content || '') + chunk }
                  : msg
              )
            )
          },
          onError: (err) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: (msg.content || '') + \`\\n\\n[Error: \${err.message}]\` }
                  : msg
              )
            )
          },
        },
        { model: activeModel, workingDir: currentFolder }
      )

      // Add final output details if needed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { 
                ...msg, 
                content: result.content,
                tokens: Math.round(result.content.length / 4), // Rough estimate
              }
            : msg
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsGenerating(false)
    }
  }`;

const newHandleSendMessage = `  const executeConversationFlow = async (history: ChatMessage[], activeModel: string) => {
    setIsGenerating(true)
    setReasoning('')

    const apiMessages = history.map((msg) => {
      const apiMsg: any = {
        role: msg.role,
        content: msg.content
      }
      if (msg.tool_calls) {
        apiMsg.tool_calls = msg.tool_calls
      }
      if (msg.tool_call_id) {
        apiMsg.tool_call_id = msg.tool_call_id
      }
      if (msg.name) {
        apiMsg.name = msg.name
      }
      return apiMsg
    })

    const tools = [
      {
        type: 'function',
        function: {
          name: 'run_terminal_command',
          description: 'Execute a terminal/shell command (e.g. npm install, npm run build, tests, git commands) in the project workspace.',
          parameters: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'The exact command to run (e.g., "npm test" or "ls").'
              }
            },
            required: ['command']
          }
        }
      }
    ]

    const assistantMsgId = Math.random().toString(36).substring(7)
    
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        model: activeModel,
      },
    ])

    try {
      const result = await streamChatCompletion(
        apiMessages,
        tools,
        {
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: (msg.content || '') + chunk }
                  : msg
              )
            )
          },
          onError: (err) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: (msg.content || '') + \`\\n\\n[Error: \${err.message}]\` }
                  : msg
              )
            )
            setIsGenerating(false)
          },
        },
        { model: activeModel, workingDir: currentFolder }
      )

      const hasToolCalls = result.toolCalls && result.toolCalls.length > 0
      
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId) {
            const updated = { 
              ...msg, 
              content: result.content || (hasToolCalls ? 'I need to run a terminal command to proceed:' : ''),
              tokens: Math.round((result.content || '').length / 4),
            }
            if (hasToolCalls) {
              updated.tool_calls = result.toolCalls.map(tc => ({
                id: tc.id || \`call_\${Math.random().toString(36).substring(7)}\`,
                type: 'function',
                function: {
                  name: tc.name,
                  arguments: typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments)
                }
              }))
              updated.toolExecutionStatus = 'pending'
            }
            return updated
          }
          return msg
        })
      )

      if (!hasToolCalls) {
        setIsGenerating(false)
      }
    } catch (error) {
      console.error('Error in conversation flow:', error)
      setIsGenerating(false)
    }
  }

  const handleRunTool = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || !message.tool_calls || message.tool_calls.length === 0) return

    const toolCall = message.tool_calls[0]
    const args = typeof toolCall.function.arguments === 'string' 
      ? JSON.parse(toolCall.function.arguments) 
      : toolCall.function.arguments
    const command = args.command

    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, toolExecutionStatus: 'running' } : m
    ))
    setIsGenerating(true)

    try {
      const res = await (window as any).nyxide.executeTerminalCommand(command, currentFolder)

      setMessages(prev => prev.map(m => 
        m.id === messageId ? { 
          ...m, 
          toolExecutionStatus: res.success ? 'completed' : 'failed',
          toolOutput: res.output
        } : m
      ))

      const toolResponseMsg = {
        id: Math.random().toString(36).substring(7),
        role: 'tool',
        name: toolCall.function.name,
        tool_call_id: toolCall.id,
        content: res.output || (res.success ? 'Command completed successfully.' : 'Command failed.'),
        timestamp: Date.now()
      }

      const updatedMessages = [...messages, toolResponseMsg]
      setMessages(prev => [...prev, toolResponseMsg])

      const activeModel = settingsOpen ? settings.model : AI_CONFIG.model
      await executeConversationFlow(updatedMessages, activeModel)

    } catch (err) {
      console.error('Error executing tool:', err)
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { 
          ...m, 
          toolExecutionStatus: 'failed',
          toolOutput: err.message
        } : m
      ))
      setIsGenerating(false)
    }
  }

  const handleCancelTool = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || !message.tool_calls || message.tool_calls.length === 0) return

    const toolCall = message.tool_calls[0]

    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, toolExecutionStatus: 'rejected' } : m
    ))

    const toolResponseMsg = {
      id: Math.random().toString(36).substring(7),
      role: 'tool',
      name: toolCall.function.name,
      tool_call_id: toolCall.id,
      content: 'Cancelled by user. The user did not approve running this command.',
      timestamp: Date.now()
    }

    const updatedMessages = [...messages, toolResponseMsg]
    setMessages(prev => [...prev, toolResponseMsg])

    const activeModel = settingsOpen ? settings.model : AI_CONFIG.model
    await executeConversationFlow(updatedMessages, activeModel)
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return

    const userMsg = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    
    const activeModel = settingsOpen ? settings.model : AI_CONFIG.model
    await executeConversationFlow(updatedMessages, activeModel)
  }`;

content = content.replace(oldHandleSendMessage.replace(/\r\n/g, '\n'), newHandleSendMessage);

// 3. Replace the rendering block in messages.map
const oldRender = `        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              padding: '12px',
              border: '2px solid #000',
              boxShadow: '4px 4px 0 #000',
              backgroundColor: msg.role === 'user' ? '#fff' : '#f5f5f5',
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
              <span>{msg.role === 'user' ? 'YOU' : 'NYXIDE ASSISTANT'}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Body */}
            {msg.content && (
              <div style={{ wordBreak: 'break-word', fontSize: '13px' }}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}`;

const newRender = `        {messages.map((msg) => (
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
                  <span>Terminal Action Required</span>
                </div>
                {msg.tool_calls.map((tc, idx) => {
                  let cmd = '';
                  try {
                    const args = typeof tc.function.arguments === 'string'
                      ? JSON.parse(tc.function.arguments)
                      : tc.function.arguments;
                    cmd = args.command || '';
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
                        $ {cmd}
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
                              ✓ Run Command
                            </button>
                          </div>
                        )}
                      </div>

                      {msg.toolOutput && (
                        <details style={{ marginTop: '10px' }}>
                          <summary style={{ fontSize: '11px', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                            Show command output
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
        ))}`;

content = content.replace(oldRender.replace(/\r\n/g, '\n'), newRender);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
