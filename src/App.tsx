import { useState, useCallback, useEffect } from 'react'
import { AppProvider, useAppState } from './context/AppContext'
import FileExplorer from './components/FileExplorer'
import EditorTabs from './components/EditorTabs'
import CodeEditor from './components/CodeEditor'
import MenuBar from './components/MenuBar'
import Terminal from './components/Terminal'

// Internal App component that uses context
function InternalApp() {
  const { tabs, activeTabPath, openFile, updateFileContent, saveFile, closeFile } = useAppState()
  const [chatOpen, setChatOpen] = useState(true)
  const [explorerOpen, setExplorerOpen] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<string>('')

  // Get active tab content
  const activeTab = tabs.find(tab => tab.path === activeTabPath)
  const activeContent = activeTab?.content || ''
  const activeLanguage = activeTab?.path.split('.').pop()?.toLowerCase()

  const handleFileClick = useCallback(async (path: string) => {
    console.log('[App] File clicked:', path)
    await openFile(path)
  }, [openFile])

  const handleSave = useCallback(async () => {
    if (!activeTabPath) return
    
    const saved = await saveFile(activeTabPath)
    if (saved) {
      console.log('File saved successfully')
    } else {
      console.log('Failed to save file')
    }
  }, [activeTabPath, saveFile])

  const handleNewFile = useCallback(() => {
    const name = prompt('Enter new file name:')
    if (name) {
      const defaultPath = explorerOpen && activeTab ? 
        activeTab.path.substring(0, activeTab.path.lastIndexOf('/')) + '/' : ''
      const fullPath = defaultPath + name
      
      // Create empty file
      ;(window as any).nyxide.writeFile(fullPath, '').then(result => {
        if (result.success) {
          openFile(fullPath)
        } else {
          alert('Failed to create file: ' + result.error)
        }
      })
    }
  }, [activeTab, openFile, explorerOpen])

  const handleOpenFolder = useCallback(() => {
    ;(window as any).nyxide.openFolderDialog().then(result => {
      if (result.success && result.path) {
        console.log('Open folder:', result.path)
        // Could load folder in Explorer here if needed
      }
    })
  }, [])

  const handleOpenFile = useCallback(() => {
    ;(window as any).nyxide.openFileDialog().then(result => {
      if (result.success && result.filePaths.length > 0) {
        openFile(result.filePaths[0])
      }
    })
  }, [openFile])

  const handleCloseTab = useCallback(() => {
    if (activeTabPath) {
      closeFile(activeTabPath)
    }
  }, [activeTabPath, closeFile])

  const handleUndo = useCallback(() => {
    if (activeTabPath) {
      ;(document.activeElement as HTMLElement)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, metaKey: true })
      )
    }
  }, [activeTabPath])

  const handleRedo = useCallback(() => {
    if (activeTabPath) {
      ;(document.activeElement as HTMLElement)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, metaKey: true })
      )
    }
  }, [activeTabPath])

  const handleFind = useCallback(() => {
    if (activeTabPath) {
      ;(document.activeElement as HTMLElement)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, metaKey: true })
      )
    }
  }, [activeTabPath])

  const handleReplace = useCallback(() => {
    if (activeTabPath) {
      ;(document.activeElement as HTMLElement)?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'h', ctrlKey: true, metaKey: true })
      )
    }
  }, [activeTabPath])

  const handleZoomIn = useCallback(() => {
    document.body.style.fontSize = '120%'
    setTimeout(() => { document.body.style.fontSize = '' }, 100)
  }, [])

  const handleZoomOut = useCallback(() => {
    document.body.style.fontSize = '80%'
    setTimeout(() => { document.body.style.fontSize = '' }, 100)
  }, [])

  const handleZoomReset = useCallback(() => {
    document.body.style.fontSize = ''
  }, [])

  const handleToggleTerminal = useCallback(() => {
    setTerminalOpen(prev => !prev)
  }, [terminalOpen])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (activeTabPath) {
          handleSave()
        }
      }
      
      // Ctrl+N - New File
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleNewFile()
      }
      
      // Ctrl+O - Open File
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault()
        handleOpenFile()
      }
      
      // Ctrl+K Ctrl+O - Open Folder
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        let kTimer: NodeJS.Timeout
        const startKTimer = () => {
          kTimer = setTimeout(() => {
            handleOpenFolder()
            clearTimeout(kTimer)
          }, 500)
        }
        clearTimeout(kTimer)
        startKTimer()
      }
      
      // Ctrl+W - Close Tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        handleCloseTab()
      }
      
      // Ctrl+B - Toggle Explorer
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setExplorerOpen(prev => !prev)
      }
      
      // Escape - Toggle chat
      if (e.key === 'Escape') {
        setChatOpen(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTabPath, handleSave, handleNewFile, handleOpenFolder, handleCloseTab])

  // Add terminal keydown handler separately
  useEffect(() => {
    const handleTerminalKey = (e: KeyboardEvent) => {
      // Ctrl+` - Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        handleToggleTerminal()
      }
    }
    window.addEventListener('keydown', handleTerminalKey)
    return () => window.removeEventListener('keydown', handleTerminalKey)
  }, [handleToggleTerminal])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Menu Bar */}
      <MenuBar
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onSave={handleSave}
        onSaveAll={handleSave}
        onCloseTab={handleCloseTab}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFind={handleFind}
        onReplace={handleReplace}
        onToggleExplorer={() => setExplorerOpen(prev => !prev)}
        onToggleChat={() => setChatOpen(prev => !prev)}
        onToggleTerminal={handleToggleTerminal}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
      
      {/* Tab Bar */}
      <EditorTabs />
      
      {/* Main Content Area - Split Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Chat Interface (20%) */}
        <div 
          style={{ 
            width: chatOpen ? '20%' : '0px',
            minWidth: chatOpen ? '200px' : '0px',
            maxWidth: chatOpen ? '350px' : '0px',
            transition: 'all 0.3s ease',
            borderRight: chatOpen ? '1px solid #3c3c3c' : 'none',
            backgroundColor: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setChatOpen(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '16px',
              zIndex: 10,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}
          >
            ×
          </button>
          
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#888',
            fontSize: '14px',
            textAlign: 'center',
            paddingTop: '40px',
          }}>
            <div>
              <p style={{ marginBottom: '8px', fontWeight: 600 }}>💬 AI Assistant</p>
              <p style={{ fontSize: '12px', color: '#666' }}>AI Integration Week 2</p>
            </div>
          </div>
        </div>

        {/* Toggle button for chat */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              width: '24px',
              height: '100%',
              background: '#2a2d2e',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #3c3c3c',
              borderBottom: '1px solid #3c3c3c',
              opacity: 0.7,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            title="Toggle Chat"
          >
            ⌨️
          </button>
        )}

        {/* Center Panel - Monaco Editor (Main) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#1e1e1e',
          display: 'flex',
          overflow: 'hidden',
        }}>
          {activeTab ? (
            <CodeEditor
              filePath={activeTab.path}
              content={activeContent}
              language={activeLanguage}
              onChange={(value) => updateFileContent(activeTab.path, value)}
              onSave={handleSave}
            />
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#888',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{ fontSize: '64px', opacity: 0.3 }}>📝</div>
              <p>No file open</p>
              <p style={{ fontSize: '13px', color: '#666' }}>
                Open a folder from Explorer or create a new file
              </p>
              <p style={{ fontSize: '12px', color: '#555' }}>
                Shortcuts: Ctrl+S (Save), Ctrl+F (Find)
              </p>
            </div>
          )}
        </div>
        
        {/* Right Panel - File Explorer (280px) */}
        <div style={{ width: explorerOpen ? '280px' : '0', minWidth: explorerOpen ? '280px' : '0px', maxWidth: explorerOpen ? '400px' : '0px', borderLeft: explorerOpen ? '1px solid #3c3c3c' : 'none', overflow: 'hidden', backgroundColor: '#252526', position: 'relative', transition: 'all 0.3s ease' }}>
          {explorerOpen && (
            <button
              onClick={() => setExplorerOpen(false)}
              style={{
                position: 'absolute',
                top: '36px',
                right: '8px',
                background: '#e0e0e0',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex: 10,
                color: '#333',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}
            >
              ×
            </button>
          )}
          
          <FileExplorer onFileClick={handleFileClick} onFolderChange={setCurrentFolder} />
        </div>

        {/* Toggle button for explorer */}
        {!explorerOpen && (
          <button
            onClick={() => setExplorerOpen(true)}
            style={{
              width: '24px',
              height: '100%',
              background: '#2a2d2e',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #3c3c3c',
              borderBottom: '1px solid #3c3c3c',
              opacity: 0.7,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            title="Toggle Explorer"
          >
            📁
          </button>
        )}
      </div>
      
        {/* Terminal Panel */}
      <div 
        style={{ 
          height: terminalOpen ? '250px' : '0px',
          minHeight: terminalOpen ? '150px' : '0px',
          maxHeight: terminalOpen ? '400px' : '0px',
          transition: 'all 0.3s ease',
          borderTop: terminalOpen ? '1px solid #3c3c3c' : 'none',
          backgroundColor: '#1e1e1e',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!terminalOpen && (
          <button
            onClick={() => setTerminalOpen(true)}
            style={{
              width: '100%',
              height: '30px',
              background: '#2a2d2e',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: 0.7,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            title="Toggle Terminal"
          >
            ⌨️ Terminal
          </button>
        )}
        
        {terminalOpen && (
          <>
            <button
              onClick={() => setTerminalOpen(false)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#e0e0e0',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex: 10,
                color: '#333',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d0d0d0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e0e0e0'}
            >
              ×
            </button>
            
            <Terminal visible={terminalOpen} cwd={currentFolder || undefined} />
          </>
        )}
      </div>
      
      {/* Status Bar */}
      <div style={{ 
        height: '24px', 
        backgroundColor: '#007acc', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '11px',
        userSelect: 'none',
        gap: '16px',
      }}>
        <span>{tabs.length} files open</span>
        {activeTab && (
          <>
            <span>{activeTab.name}</span>
            <span>{activeLanguage?.toUpperCase()}</span>
            {activeTab.modified && <span>Modified</span>}
            <span>UTF-8</span>
            <span>LF</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span>NyxIDE v0.1.0</span>
      </div>
    </div>
  )
}

// Export with provider
export default function App() {
  return (
    <AppProvider>
      <InternalApp />
    </AppProvider>
  )
}
