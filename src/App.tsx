import { useState, useCallback, useEffect } from 'react'
import { AppProvider, useAppState } from './context/AppContext'
import FileExplorer from './components/FileExplorer'
import EditorTabs from './components/EditorTabs'
import CodeEditor from './components/CodeEditor'
import MenuBar from './components/MenuBar'
import Terminal from './components/Terminal'
import NewFileModal from './components/NewFileModal'
import ChatPanel from './components/ChatPanel'

// Internal App component that uses context
function InternalApp() {
  const { tabs, activeTabPath, openFile, updateFileContent, saveFile, closeFile, refreshTab } = useAppState()
  const [chatOpen, setChatOpen] = useState(true)
  const [explorerOpen, setExplorerOpen] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<string>('')
  const [newFileModalOpen, setNewFileModalOpen] = useState(false)

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
    setNewFileModalOpen(true)
  }, [])

  const handleCreateFile = useCallback(async (fileName: string) => {
    if (!currentFolder) {
      throw new Error('No folder selected')
    }

    const fullPath = currentFolder + '/' + fileName
    
    // Create empty file
    const result = await (window as any).nyxide.writeFile(fullPath, '')
    if (result.success) {
      await openFile(fullPath)
      // Refresh file explorer to show new file
      if ((window as any).fileExplorerRefresh) {
        (window as any).fileExplorerRefresh()
      }
    } else {
      throw new Error(result.error || 'Failed to create file')
    }
  }, [currentFolder, openFile])

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
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#fff' }}>
        {/* Left Panel - Chat Interface (20%) */}
        <div 
          style={{ 
            width: chatOpen ? '22%' : '0px',
            minWidth: chatOpen ? '240px' : '0px',
            maxWidth: chatOpen ? '380px' : '0px',
            transition: 'all 0.2s ease',
            borderRight: chatOpen ? '3px solid #000' : 'none',
            backgroundColor: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {chatOpen && (
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <ChatPanel currentFolder={currentFolder} onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>

        {/* Toggle button for chat */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              width: '32px',
              height: '100%',
              background: '#000',
              border: 'none',
              borderRight: '3px solid #000',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#000')}
            title="Toggle Chat"
          >
            💬
          </button>
        )}

        {/* Center Panel - Monaco Editor (Main) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#ffffff',
          display: 'flex',
          overflow: 'hidden',
          borderRight: '3px solid #000',
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
        <div style={{ 
          width: explorerOpen ? '300px' : '0', 
          minWidth: explorerOpen ? '300px' : '0px', 
          maxWidth: explorerOpen ? '400px' : '0px', 
          borderLeft: explorerOpen ? '3px solid #000' : 'none', 
          overflow: 'hidden', 
          backgroundColor: '#fff', 
          position: 'relative', 
          transition: 'all 0.2s ease' 
        }}>
          <FileExplorer onFileClick={handleFileClick} onFolderChange={setCurrentFolder} onClose={() => setExplorerOpen(false)} />
        </div>

        {/* Toggle button for explorer */}
        {!explorerOpen && (
          <button
            onClick={() => setExplorerOpen(true)}
            style={{
              width: '32px',
              height: '100%',
              background: '#000',
              border: 'none',
              borderLeft: '3px solid #000',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#000')}
            title="Toggle Explorer"
          >
            📁
          </button>
        )}
      </div>
      
        {/* Terminal Panel */}
      <div 
        style={{ 
          height: terminalOpen ? '280px' : '0px',
          minHeight: terminalOpen ? '150px' : '0px',
          maxHeight: terminalOpen ? '400px' : '0px',
          transition: 'all 0.2s ease',
          borderTop: terminalOpen ? '3px solid #000' : 'none',
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!terminalOpen && (
          <button
            onClick={() => setTerminalOpen(true)}
            style={{
              width: '100%',
              height: '32px',
              background: '#000',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#000')}
            title="Toggle Terminal"
          >
            ▶ Show Terminal
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
                background: '#fff',
                border: '2px solid #fff',
                boxShadow: '2px 2px 0 #000',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 900,
                color: '#000',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            
            <Terminal visible={terminalOpen} cwd={currentFolder || undefined} />
          </>
        )}
      </div>
      
      {/* Status Bar - Neo Brutalism */}
      <div style={{ 
        height: '28px', 
        backgroundColor: '#000', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        userSelect: 'none',
        gap: '16px',
        borderTop: '2px solid #000',
      }}>
        <span style={{ fontWeight: 900 }}>● {tabs.length} FILES</span>
        {activeTab && (
          <>
            <span style={{ opacity: 0.7 }}>│</span>
            <span>{activeTab.name.toUpperCase()}</span>
            <span style={{ opacity: 0.7 }}>│</span>
            <span>{activeLanguage?.toUpperCase()}</span>
            {activeTab.modified && (
              <>
                <span style={{ opacity: 0.7 }}>│</span>
                <span style={{ color: '#fff', fontWeight: 900 }}>● MODIFIED</span>
              </>
            )}
            <span style={{ opacity: 0.7 }}>│</span>
            <span>UTF-8</span>
            <span style={{ opacity: 0.7 }}>│</span>
            <span>LF</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontWeight: 900 }}>NYXIDE v0.1.0</span>
      </div>
      
      {/* New File Modal */}
      <NewFileModal
        open={newFileModalOpen}
        defaultPath={currentFolder}
        onClose={() => setNewFileModalOpen(false)}
        onCreateFile={handleCreateFile}
      />
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
