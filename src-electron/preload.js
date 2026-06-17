import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods via context bridge
contextBridge.exposeInMainWorld('nyxide', {
  // File system operations
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
  listDirectory: (dir) => ipcRenderer.invoke('list-directory', dir),
  searchFiles: (dir, pattern) => ipcRenderer.invoke('search-files', dir, pattern),
  createDirectory: (path) => ipcRenderer.invoke('create-directory', path),
  deleteFile: (path) => ipcRenderer.invoke('delete-file', path),
  
  // Command execution
  execCommand: (command) => ipcRenderer.invoke('exec-command', command),
  
  // Tab management
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  closeFile: (path) => ipcRenderer.invoke('close-file', path),
  getOpenFiles: () => ipcRenderer.invoke('get-open-files'),
  
  // Current working directory
  getCwd: () => ipcRenderer.invoke('get-cwd'),
  
  // Dialog operations
  openFolderDialog: () => ipcRenderer.invoke('dialog:open-folder'),
})
