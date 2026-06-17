import { useState, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'

// Mock open files for Week 1 demo
const MOCK_FILES = [
  { path: '/home/nyx/Documents/nyxide/README.md', name: 'README.md', modified: false },
  { path: '/home/nyx/Documents/nyxide/package.json', name: 'package.json', modified: false },
]

export default function EditorTabs() {
  const [tabs, setTabs] = useState(MOCK_FILES)
  const [activeTab, setActiveTab] = useState(MOCK_FILES[0]?.path || '')

  // Listen for file tab changes from Electron main process
  useEffect(() => {
    if ((window as any).nyxide?.getOpenFiles) {
      ;(window as any).nyxide.getOpenFiles().then(({ tabs }: { tabs: string[] }) => {
        // Convert paths to tab objects
        setTabs(tabs.map(path => ({ 
          path, 
          name: path.split('/').pop() || 'Untitled',
          modified: false 
        })))
      })
    }
  }, [])

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    
    if ((window as any).nyxide?.closeFile) {
      ;(window as any).nyxide.closeFile(path).then(({ tabs }: { tabs: string[] }) => {
        setTabs(tabs.map(p => ({ 
          path: p, 
          name: p.split('/').pop() || 'Untitled',
          modified: false 
        })))
        
        if (activeTab === path && tabs.length > 0) {
          setActiveTab(tabs[tabs.length - 1])
        } else if (tabs.length === 0) {
          setActiveTab('')
        }
      })
    }
  }

  return (
    <div style={{
      height: '32px',
      backgroundColor: '#252526',
      display: 'flex',
      alignItems: 'flex-end',
      overflowX: 'auto',
      borderBottom: '1px solid #3c3c3c',
    }}>
      {/* New Tab Button */}
      <button
        style={{
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
        onClick={() => alert('Create new file feature coming in Week 2!')}
      >
        <span>➕</span> New File
      </button>

      {/* Tabs */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => setActiveTab(tab.path)}
          style={{
            padding: '8px 12px',
            backgroundColor: activeTab === tab.path ? '#1e1e1e' : 'transparent',
            borderRight: '1px solid #3c3c3c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            minWidth: '120px',
            maxWidth: '200px',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.path) {
              e.currentTarget.style.backgroundColor = '#2a2d2e'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.path) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          <span>{tab.modified ? '● ' : ''}</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tab.name}
          </span>
          <button
            onClick={(e) => handleCloseTab(e, tab.path)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            <CloseOutlined />
          </button>
        </div>
      ))}
      
      {/* Monaco Editor Placeholder (Week 1-2 integration) */}
      {tabs.length === 0 && (
        <div style={{ padding: '8px 12px', color: '#666', fontSize: '12px' }}>
          No files open • Use File Explorer on the right or create a new file
        </div>
      )}
    </div>
  )
}
