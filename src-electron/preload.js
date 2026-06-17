import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods via context bridge
contextBridge.exposeInMainWorld('nyxide', {
  // File system operations
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('write-file', path, content),
  listDirectory: (dir: string) => ipcRenderer.invoke('list-directory', dir),
  searchFiles: (dir: string, pattern: string) => ipcRenderer.invoke('search-files', dir, pattern),
  createDirectory: (path: string) => ipcRenderer.invoke('create-directory', path),
  deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
  
  // Command execution
  execCommand: (command: string) => ipcRenderer.invoke('exec-command', command),
  
  // Tab management
  openFile: (path: string) => ipcRenderer.invoke('open-file', path),
  closeFile: (path: string) => ipcRenderer.invoke('close-file', path),
  getOpenFiles: () => ipcRenderer.invoke('get-open-files'),
  
  // Current working directory
  getCwd: () => ipcRenderer.invoke('get-cwd'),
})
