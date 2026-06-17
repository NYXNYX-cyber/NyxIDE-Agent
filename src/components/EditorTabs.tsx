import { useAppState } from '../context/AppContext'
import { CloseOutlined } from '@ant-design/icons'

export default function EditorTabs() {
  const { tabs, activeTabPath, setActiveTab, closeFile } = useAppState()

  const handleCloseTab = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    await closeFile(path)
  }

  return (
    <div style={{
      height: '36px',
      backgroundColor: '#252526',
      display: 'flex',
      alignItems: 'flex-end',
      overflowX: 'auto',
      overflowY: 'hidden',
      borderBottom: '1px solid #3c3c3c',
    }}>
      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = activeTabPath === tab.path
        return (
          <div
            key={tab.path}
            onClick={() => setActiveTab(tab.path)}
            style={{
              padding: '8px 12px',
              backgroundColor: isActive ? '#1e1e1e' : '#2d2d2d',
              borderRight: '1px solid #3c3c3c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              minWidth: '120px',
              maxWidth: '200px',
              userSelect: 'none',
              borderBottom: isActive ? '2px solid #007acc' : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#2a2d2e'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
              }
            }}
          >
            <span style={{ color: tab.modified ? '#fff' : '#888' }}>
              {tab.modified ? '●' : '○'}
            </span>
            <span style={{ 
              flex: 1, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              color: isActive ? '#fff' : '#888',
            }}>
              {tab.name}
            </span>
            <button
              onClick={(e) => handleCloseTab(e, tab.path)}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.backgroundColor = '#3c3c3c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <CloseOutlined style={{ fontSize: '10px' }} />
            </button>
          </div>
        )
      })}
      
      {/* Empty state */}
      {tabs.length === 0 && (
        <div style={{ 
          padding: '8px 12px', 
          color: '#666', 
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
        }}>
          No files open • Click a file in the Explorer to open it
        </div>
      )}
    </div>
  )
}
