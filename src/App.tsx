import { useState } from 'react'
import FileExplorer from './components/FileExplorer'
import ChatPanel from './components/ChatPanel'
import EditorTabs from './components/EditorTabs'

// Main IDE Layout with Split Pane (50/50 - Chat Left, Editor Right)
function App() {
  const [chatOpen, setChatOpen] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab Bar */}
      <EditorTabs />
      
      {/* Main Content Area - Split Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Chat Interface */}
        <div 
          style={{ 
            width: chatOpen ? '50%' : '0%',
            transition: 'width 0.3s ease',
            borderRight: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <ChatPanel />
        </div>

        {/* Center Panel - Monaco Editor Placeholder */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#1e1e1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
        }}>
          {!chatOpen && (
            <div>Click 📁 icon to open File Explorer or drag resize divider</div>
          )}
        </div>
        
        {/* Right Panel - File Explorer */}
        <div style={{ width: '280px', borderLeft: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <FileExplorer />
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
        fontSize: '12px',
        userSelect: 'none',
      }}>
        <span>NyxIDE • Ready</span>
      </div>
    </div>
  )
}

export default App
