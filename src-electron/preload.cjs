const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nyxide', {
  // File operations
  readDir: (path) => ipcRenderer.invoke('file:read-dir', path),
  readFile: (path) => ipcRenderer.invoke('file:read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('file:write-file', { path, content }),
  createFolder: (path) => ipcRenderer.invoke('file:create-folder', path),
  deleteFile: (path) => ipcRenderer.invoke('file:delete-file', path),
  selectFolder: () => ipcRenderer.invoke('file:select-folder'),

  // Terminal
  sendTerminalInput: (data) => ipcRenderer.send('terminal:input', data),
  resizeTerminal: (cols, rows) => ipcRenderer.send('terminal:resize', { cols, rows }),
  onTerminalData: (callback) => {
    const subscription = (event, data) => callback(data)
    ipcRenderer.on('terminal:data', subscription)
    return () => ipcRenderer.removeListener('terminal:data', subscription)
  },
  executeTerminalCommand: (command, cwd) => ipcRenderer.invoke('terminal:execute-command', { command, cwd }),

  // AI Stream
  aiChatStream: (requestBody) => ipcRenderer.invoke('ai:chat-stream', requestBody),
  onAIStreamChunk: (callback) => ipcRenderer.on('ai:stream-chunk', (event, chunk) => callback(chunk)),
  onAIStreamEnd: (callback) => ipcRenderer.on('ai:stream-end', (event) => callback()),
  onAIStreamError: (callback) => ipcRenderer.on('ai:stream-error', (event, error) => callback(error)),
})
