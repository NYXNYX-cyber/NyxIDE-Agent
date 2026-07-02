import { useAppState } from '../context/AppContext'
import { CloseOutlined } from '@ant-design/icons'

interface EditorTabsProps {
  currentFolder?: string
}

export default function EditorTabs({ currentFolder }: EditorTabsProps) {
  const { tabs, activeTabPath, setActiveTab, closeFile } = useAppState()

  const handleCloseTab = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    await closeFile(path)
  }

  return (
    <div style={{
      height: '40px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      overflowY: 'hidden',
      borderBottom: '3px solid #000',
    }}>
      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = activeTabPath === tab.path
        return (
          <div
            key={tab.path}
            onClick={() => setActiveTab(tab.path)}
            style={{
              padding: '8px 14px',
              backgroundColor: isActive ? '#000' : '#fff',
              color: isActive ? '#fff' : '#000',
              borderRight: '2px solid #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              minWidth: '120px',
              maxWidth: '200px',
              userSelect: 'none',
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#fff'
              }
            }}
          >
            <span style={{ fontWeight: 900, fontSize: '14px' }}>
              {tab.modified ? '●' : '○'}
            </span>
            <span style={{ 
              flex: 1, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {tab.name}
            </span>
            <button
              onClick={(e) => handleCloseTab(e, tab.path)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#fff' : '#000',
                cursor: 'pointer',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 900,
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ff0000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive ? '#fff' : '#000'
              }}
            >
              ✕
            </button>
          </div>
        )
      })}
      
      {/* Empty state */}
      {tabs.length === 0 && (
        <div style={{ 
          padding: '8px 14px', 
          color: '#000', 
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          gap: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {currentFolder ? (
            <>
              <span>📂</span>
              <span style={{ textTransform: 'none', fontWeight: 900 }}>{currentFolder}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>No files open</span>
            </>
          ) : (
            <span>○ No files open • Click a file in the Explorer to open</span>
          )}
        </div>
      )}
    </div>
  )
}
