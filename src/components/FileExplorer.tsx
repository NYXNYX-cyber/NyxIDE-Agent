import { useState, useEffect } from 'react'
import { FolderOutlined, FileOutlined } from '@ant-design/icons'

interface FileItem {
  name: string
  isDirectory: boolean
  isFile: boolean
}

interface FileExplorerProps {
  rootPath?: string
}

export default function FileExplorer({ rootPath = '' }: FileExplorerProps) {
  const [cwd, setCwd] = useState<string>('')
  const [items, setItems] = useState<FileItem[]>([])
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [currentPath, setCurrentPath] = useState<string>(rootPath)

  // Get current working directory on mount
  useEffect(() => {
    if ((window as any).nyxide?.getCwd) {
      ;(window as any).nyxide.getCwd().then(({ cwd }: { cwd: string }) => {
        setCwd(cwd)
        setCurrentPath(cwd)
        listDirectory(cwd)
      })
    }
  }, [])

  const listDirectory = async (path: string) => {
    try {
      const result = await (window as any).nyxide.listDirectory(path)
      if (result.success) {
        setItems(result.items || [])
      } else {
        console.error('Failed to list directory:', result.error)
      }
    } catch (error) {
      console.error('Error listing directory:', error)
    }
  }

  const handleItemClick = async (item: FileItem) => {
    if (item.isDirectory) {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name
      setCurrentPath(newPath)
      listDirectory(newPath)
      
      // Expand directory
      const newExpanded = new Set(expandedDirs)
      newExpanded.add(newPath)
      setExpandedDirs(newExpanded)
    }
  }

  const toggleExpand = (dirName: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dirName)) {
      newExpanded.delete(dirName)
    } else {
      newExpanded.add(dirName)
    }
    setExpandedDirs(newExpanded)
  }

  const renderTree = () => {
    return items.map((item, index) => {
      const key = currentPath ? `${currentPath}/${item.name}` : item.name
      const isExpanded = expandedDirs.has(key)
      
      return (
        <div key={index} style={{ marginLeft: 0 }}>
          <div
            onClick={() => handleItemClick(item)}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              fontSize: '13px',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#264de4')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {item.isDirectory && (
              <span 
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(key)
                }}
                style={{ marginRight: '4px', cursor: 'pointer' }}
              >
                {isExpanded ? '📂' : '📁'}
              </span>
            )}
            {!item.isDirectory && (
              <span style={{ marginRight: '4px' }}>📄</span>
            )}
            <span>{item.name}</span>
          </div>
          
          {/* Render subdirectory contents */}
          {item.isDirectory && isExpanded && (
            <div style={{ marginLeft: '16px' }}>
              {renderSubDirectory(currentPath, item.name, expandedDirs)}
            </div>
          )}
        </div>
      )
    })
  }

  const renderSubDirectory = (parentPath: string, dirName: string, dirs: Set<string>) => {
    const subdirPath = parentPath ? `${parentPath}/${dirName}` : dirName
    // For now, just show a placeholder - full implementation would recursively load
    return (
      <div style={{ color: '#888', fontSize: '12px', padding: '4px 8px' }}>
        Loading... (Week 2: Full recursive loading)
      </div>
    )
  }

  return (
    <div style={{ height: '100%', backgroundColor: '#252526', overflowY: 'auto' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #3c3c3c', backgroundColor: '#252526' }}>
        <strong style={{ color: '#fff', fontSize: '12px' }}>EXPLORER</strong>
      </div>
      <div style={{ padding: '8px 0' }}>
        {cwd && (
          <div
            onClick={() => {
              setCurrentPath(cwd)
              listDirectory(cwd)
            }}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              fontSize: '13px',
              backgroundColor: '#37373d',
            }}
          >
            <span style={{ marginRight: '4px' }}>📁</span>
            <span>{cwd}</span>
          </div>
        )}
        <div style={{ marginTop: '8px' }}>{renderTree()}</div>
      </div>
    </div>
  )
}
