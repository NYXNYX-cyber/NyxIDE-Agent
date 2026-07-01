const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const __dirname = path.dirname(__filename)

// Track open files for multi-tab support
let openFiles = []

let mainWindow = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs')
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

  // PTY (Pseudo-Terminal) management for proper terminal emulation
  const ptyInstances = new Map()
  
  ipcMain.handle('pty-create', async (event, options = {}) => {
    try {
      const os = await import('os')
      const { default: pty } = await import('node-pty')
      
      const id = Date.now().toString()
      const cwd = options.cwd || os.homedir()
      const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash'
      
      const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: options.cols || 120,
        rows: options.rows || 24,
        cwd: cwd,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
        },
      })
      
      ptyInstances.set(id, ptyProcess)
      
      // Forward PTY output to renderer
      ptyProcess.onData((data) => {
        mainWindow.webContents.send('pty-data', { id, data })
      })
      
      ptyProcess.onExit(({ exitCode }) => {
        mainWindow.webContents.send('pty-exit', { id, exitCode })
        ptyInstances.delete(id)
      })
      
      return { success: true, id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  ipcMain.handle('pty-write', async (event, id, data) => {
    try {
      const ptyProcess = ptyInstances.get(id)
      if (ptyProcess) {
        ptyProcess.write(data)
        return { success: true }
      }
      return { success: false, error: 'PTY instance not found' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  ipcMain.handle('pty-resize', async (event, id, cols, rows) => {
    try {
      const ptyProcess = ptyInstances.get(id)
      if (ptyProcess) {
        ptyProcess.resize(cols, rows)
        return { success: true }
      }
      return { success: false, error: 'PTY instance not found' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  ipcMain.handle('pty-kill', async (event, id) => {
    try {
      const ptyProcess = ptyInstances.get(id)
      if (ptyProcess) {
        ptyProcess.kill()
        ptyInstances.delete(id)
        return { success: true }
      }
      return { success: false, error: 'PTY instance not found' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('exec-command', async (event, command, options = {}) => {
    try {
      const { exec } = await import('child_process')
      const os = await import('os')
      
      // Determine working directory
      const cwd = options.cwd || os.homedir()
      
      // Pass COLUMNS env var so commands like ls format output properly
      const env = {
        ...process.env,
        COLUMNS: String(options.columns || 120),  // Wider default for better formatting
        LINES: String(options.rows || 24),
        TERM: 'xterm-256color',
        FORCE_COLOR: '1',  // Force color output
      }
      
      // Auto-enhance common commands for better terminal output
      let enhancedCommand = command
      
      // For 'ls' without flags that control output format, use GNU ls style colors
      if (/^ls(\s|$)/.test(command.trim()) && !/-(C|x|1|R|l|d|G|p)/.test(command)) {
        enhancedCommand = `${command} --color=always -C`
      }
      
      // For 'ls -la' or 'ls -l', add --color=always for colored output
      if (/^ls\s+-[a-zA-Z]*l/.test(command.trim()) && !/--color/.test(command)) {
        enhancedCommand = command + ' --color=always'
      }
      
      return new Promise((resolve) => {
        exec(enhancedCommand, { cwd, env, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
          if (error) {
            resolve({ success: false, error: error.message, stderr, stdout })
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

  // AI API Proxy - bypass CORS by making requests from main process
  ipcMain.handle('ai:chat-stream', async (event, requestBody) => {
    try {
      console.log('[IPC] AI stream request received')
      const apiUrl = 'https://slip-live-managed-python.trycloudflare.com/v1/chat/completions'
      const apiKey = 'sk-cf0251454562791d-7535b8-3a469fcd'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { success: false, error: `HTTP ${response.status}: ${errorText}` }
      }

      if (!response.body) {
        return { success: false, error: 'No response body' }
      }

      // Read stream and send chunks to renderer
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      const sender = event.sender
      
      // Process stream in background
      ;(async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              sender.send('ai:stream-end')
              break
            }
            const chunk = decoder.decode(value, { stream: true })
            sender.send('ai:stream-chunk', chunk)
          }
        } catch (err) {
          console.error('[IPC] Stream error:', err)
          sender.send('ai:stream-error', err.message)
        }
      })()

      return { success: true, streaming: true }
    } catch (error) {
      console.error('[IPC] AI request error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('terminal:execute-command', async (event, { command, cwd }) => {
    const { exec } = require('child_process');
    return new Promise((resolve) => {
      if (mainWindow) {
        mainWindow.webContents.send('terminal:data', `\r\n\x1b[33m[NyxIDE Agent] Running: ${command}\x1b[0m\r\n`);
      }
      const child = exec(command, { cwd: cwd || process.env.HOME || process.env.USERPROFILE });
      let output = '';
      child.stdout.on('data', (data) => {
        output += data;
        if (mainWindow) {
          mainWindow.webContents.send('terminal:data', data.toString().replace(/\n/g, '\r\n'));
        }
      });
      child.stderr.on('data', (data) => {
        output += data;
        if (mainWindow) {
          mainWindow.webContents.send('terminal:data', `\x1b[31m${data.toString().replace(/\n/g, '\r\n')}\x1b[0m`);
        }
      });
      child.on('close', (code) => {
        if (mainWindow) {
          mainWindow.webContents.send('terminal:data', `\r\n\x1b[32m[NyxIDE Agent] Command finished with exit code ${code}\x1b[0m\r\n`);
        }
        resolve({ success: code === 0, code, output });
      });
      child.on('error', (err) => {
        const errMsg = err.message;
        if (mainWindow) {
          mainWindow.webContents.send('terminal:data', `\r\n\x1b[31m[NyxIDE Agent] Command error: ${errMsg}\x1b[0m\r\n`);
        }
        resolve({ success: false, code: -1, output: errMsg });
      });
    });
  });
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
