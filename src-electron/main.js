import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Track open files for multi-tab support
let openFiles = []

let mainWindow = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js')
  console.log('[Main] Preload script path:', preloadPath)
  console.log('[Main] __dirname:', __dirname)
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    titleBarStyle: 'hidden',
    frame: true,
  })

  // Load development server or built files
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle file system operations
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      return { success: true, content: fs.readFileSync(filePath, 'utf-8') }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('list-directory', async (event, dirPath) => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })
      return {
        success: true,
        items: items.map(item => ({
          name: item.name,
          isDirectory: item.isDirectory(),
          isFile: item.isFile(),
        })),
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('search-files', async (event, directory, pattern) => {
    try {
      const results = []
      const searchInDir = (dir) => {
        const items = fs.readdirSync(dir, { withFileTypes: true })
        for (const item of items) {
          const fullPath = path.join(dir, item.name)
          if (item.isDirectory()) {
            searchInDir(fullPath)
          } else if (item.name.includes(pattern)) {
            results.push(fullPath)
          }
        }
      }
      searchInDir(directory)
      return { success: true, results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('create-directory', async (event, dirPath) => {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-file', async (event, filePath) => {
    try {
      fs.unlinkSync(filePath)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('exec-command', async (event, command) => {
    try {
      const { exec } = await import('child_process')
      return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            resolve({ success: false, error: error.message, stderr })
          } else {
            resolve({ success: true, stdout, stderr })
          }
        })
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // File tab management
  ipcMain.handle('open-file', (event, filePath) => {
    if (!openFiles.includes(filePath)) {
      openFiles.push(filePath)
    }
    return { success: true, tabs: openFiles }
  })

  ipcMain.handle('close-file', (event, filePath) => {
    openFiles = openFiles.filter(f => f !== filePath)
    return { success: true, tabs: openFiles }
  })

  ipcMain.handle('get-open-files', () => {
    return { success: true, tabs: openFiles }
  })

  // Current working directory
  ipcMain.handle('get-cwd', () => {
    return { cwd: process.cwd() }
  })

  // Open folder dialog
  ipcMain.handle('dialog:open-folder', async () => {
    try {
      console.log('[IPC] Opening folder dialog...')
      console.log('[IPC] mainWindow exists:', !!mainWindow)
      
      // Ensure mainWindow is available
      if (!mainWindow) {
        console.error('[IPC] mainWindow is null!')
        return { success: false, error: 'Window not ready' }
      }
      
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Open Folder',
      })
      
      console.log('[IPC] Dialog result:', result)
      
      if (result.canceled) {
        return { success: false, canceled: true }
      }
      
      return { success: true, path: result.filePaths[0] }
    } catch (error) {
      console.error('[IPC] Dialog error:', error)
      return { success: false, error: error.message }
    }
  })

  // Open file dialog
  ipcMain.handle('dialog:open-file', async () => {
    try {
      console.log('[IPC] Opening file dialog...')
      
      if (!mainWindow) {
        console.error('[IPC] mainWindow is null!')
        return { success: false, error: 'Window not ready' }
      }
      
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        title: 'Open File',
      })
      
      if (result.canceled) {
        return { success: false, canceled: true, filePaths: [] }
      }
      
      return { success: true, filePaths: result.filePaths }
    } catch (error) {
      console.error('[IPC] File dialog error:', error)
      return { success: false, error: error.message }
    }
  })
}

// Wait for Electron to be ready before creating windows
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
