import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Track open files for multi-tab support
let openFiles: string[] = []

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
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
  ipcMain.handle('read-file', async (event, filePath: string) => {
    try {
      return { success: true, content: fs.readFileSync(filePath, 'utf-8') }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('list-directory', async (event, dirPath: string) => {
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
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('search-files', async (event, directory: string, pattern: string) => {
    try {
      const results: string[] = []
      const searchInDir = (dir: string) => {
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
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('create-directory', async (event, dirPath: string) => {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-file', async (event, filePath: string) => {
    try {
      fs.unlinkSync(filePath)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('exec-command', async (event, command: string) => {
    try {
      const { exec } = await import('child_process')
      return new Promise((resolve) => {
        exec(command, (error: any, stdout: string, stderr: string) => {
          if (error) {
            resolve({ success: false, error: error.message, stderr })
          } else {
            resolve({ success: true, stdout, stderr })
          }
        })
      })
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // File tab management
  ipcMain.handle('open-file', (event, filePath: string) => {
    if (!openFiles.includes(filePath)) {
      openFiles.push(filePath)
    }
    return { success: true, tabs: openFiles }
  })

  ipcMain.handle('close-file', (event, filePath: string) => {
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
