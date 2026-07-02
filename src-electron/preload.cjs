const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nyxide', {
  // File system operations
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
  listDirectory: (dir) => ipcRenderer.invoke('list-directory', dir),
  searchFiles: (dir, pattern) => ipcRenderer.invoke('search-files', dir, pattern),
  createDirectory: (path) => ipcRenderer.invoke('create-directory', path),
  deleteFile: (path) => ipcRenderer.invoke('delete-file', path),
  createFile: (path, content = '') => ipcRenderer.invoke('write-file', path, content),

  // Command execution (legacy)
  execCommand: (command, options) => ipcRenderer.invoke('exec-command', command, options),

  // PTY (Pseudo-Terminal) operations
  ptyCreate: (options) => ipcRenderer.invoke('pty-create', options),
  ptyWrite: (id, data) => ipcRenderer.invoke('pty-write', id, data),
  ptyResize: (id, cols, rows) => ipcRenderer.invoke('pty-resize', id, cols, rows),
  ptyKill: (id) => ipcRenderer.invoke('pty-kill', id),

  // PTY event listeners
  onPtyData: (callback) => ipcRenderer.on('pty-data', (event, payload) => callback(payload)),
  onPtyExit: (callback) => ipcRenderer.on('pty-exit', (event, payload) => callback(payload)),

  // Tab management
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  closeFile: (path) => ipcRenderer.invoke('close-file', path),
  getOpenFiles: () => ipcRenderer.invoke('get-open-files'),

  // Current working directory
  getCwd: () => ipcRenderer.invoke('get-cwd'),

  // Dialog operations
  openFolderDialog: () => ipcRenderer.invoke('dialog:open-folder'),
  openFileDialog: () => ipcRenderer.invoke('dialog:open-file'),

  // AI API Proxy (bypass CORS)
  aiChatStream: (requestBody) => ipcRenderer.invoke('ai:chat-stream', requestBody),
  onAIStreamChunk: (callback) => {
    ipcRenderer.removeAllListeners('ai:stream-chunk')
    ipcRenderer.on('ai:stream-chunk', (event, chunk) => callback(chunk))
  },
  onAIStreamEnd: (callback) => {
    ipcRenderer.removeAllListeners('ai:stream-end')
    ipcRenderer.on('ai:stream-end', () => callback())
  },
  onAIStreamError: (callback) => {
    ipcRenderer.removeAllListeners('ai:stream-error')
    ipcRenderer.on('ai:stream-error', (event, error) => callback(error))
  },

  // Terminal execution (AI agent)
  executeTerminalCommand: (command, cwd) => ipcRenderer.invoke('terminal:execute-command', { command, cwd }),
})
