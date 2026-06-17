import { useState, useCallback, useEffect } from 'react'
import { AppProvider, useAppState } from './context/AppContext'
import FileExplorer from './components/FileExplorer'
import EditorTabs from './components/EditorTabs'
import CodeEditor from './components/CodeEditor'

// Internal App component that uses context
function InternalApp() {
  const { tabs, activeTabPath, openFile, updateFileContent, saveFile } = useAppState()
  const [chatOpen, setChatOpen] = useState(true)

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
  }, [activeTabPath, activeTab, saveFile])

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
      
      // Escape - Toggle chat
      if (e.key === 'Escape') {
        setChatOpen(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTabPath, activeTab, handleSave])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab Bar */}
      <EditorTabs />
      
      {/* Main Content Area - Split Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Chat Interface (collapsible) */}
        <div 
          style={{ 
            width: chatOpen ? '50%' : '0%',
            transition: 'width 0.3s ease',
            borderRight: '1px solid #e5e7eb',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#888',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            <div>
              <p style={{ marginBottom: '8px' }}>💬 Chat Assistant</p>
              <p style={{ fontSize: '12px' }}>AI Integration coming in Week 2!</p>
            </div>
          </div>
        </div>

        {/* Center Panel - Monaco Editor */}
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
        
        {/* Right Panel - File Explorer */}
        <div style={{ width: '280px', borderLeft: '1px solid #3c3c3c', overflow: 'hidden', backgroundColor: '#252526' }}>
          <FileExplorer onFileClick={handleFileClick} />
        </div>
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
        <span>NyxIDE</span>
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
