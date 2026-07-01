import { useState, useEffect } from 'react'
import { FolderOutlined, FolderOpenOutlined, FileOutlined } from '@ant-design/icons'

interface FileItem {
  name: string
  isDirectory: boolean
  isFile: boolean
  path: string
}

interface FileExplorerProps {
  onFileClick?: (path: string) => void
  onFolderChange?: (path: string) => void
  onClose?: () => void
}

interface TreeNode extends FileItem {
  children?: TreeNode[]
  isLoading?: boolean
  isExpanded?: boolean
}

export default function FileExplorer({ onFileClick, onFolderChange, onClose }: FileExplorerProps) {
  const [rootPath, setRootPath] = useState<string>('')
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState<number>(0)

  // Load root directory when rootPath changes or refreshKey changes
  useEffect(() => {
    if (rootPath) {
      loadDirectory(rootPath).then(items => {
        setTreeData(items)
      })
      // Notify parent about folder change (always notify when rootPath changes)
      if (onFolderChange) {
        onFolderChange(rootPath)
      }
    }
  }, [rootPath, refreshKey])

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Expose refresh function via window object for parent to call
  useEffect(() => {
    (window as any).fileExplorerRefresh = refresh
    return () => {
      delete (window as any).fileExplorerRefresh
    }
  }, [])

  const loadDirectory = async (dirPath: string): Promise<TreeNode[]> => {
    try {
      const result = await (window as any).nyxide.listDirectory(dirPath)
      if (result.success) {
        return (result.items || []).map((item: FileItem) => ({
          ...item,
          path: dirPath + '/' + item.name,
          isExpanded: false,
          isLoading: false,
          children: item.isDirectory ? [] : undefined,
        }))
      }
      return []
    } catch (error) {
      console.error('Error loading directory:', error)
      return []
    }
  }

  const handleOpenFolder = async () => {
    console.log('[FileExplorer] Open Folder button clicked')
    try {
      console.log('[FileExplorer] Calling openFolderDialog IPC...')
      const result = await (window as any).nyxide.openFolderDialog()
      console.log('[FileExplorer] Dialog result:', result)
      
      if (result.success && result.path) {
        console.log('[FileExplorer] Setting root path to:', result.path)
        setRootPath(result.path)
      }
    } catch (error) {
      console.error('[FileExplorer] Error opening folder:', error)
    }
  }

  const toggleDirectory = async (node: TreeNode, path: number[]) => {
    const newTreeData = [...treeData]
    let current = newTreeData
    
    // Navigate to the node
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children || []
    }
    
    const targetNode = current[path[path.length - 1]]
    
    if (targetNode.isExpanded) {
      // Collapse
      targetNode.isExpanded = false
    } else {
      // Expand - load children if not loaded yet
      targetNode.isExpanded = true
      if (targetNode.children && targetNode.children.length === 0) {
        targetNode.isLoading = true
        setTreeData([...newTreeData])
        
        const children = await loadDirectory(targetNode.path)
        targetNode.children = children
        targetNode.isLoading = false
      }
    }
    
    setTreeData(newTreeData)
  }

  const handleItemClick = (item: TreeNode) => {
    console.log('[FileExplorer] Item clicked:', item.name, 'isFile:', item.isFile, 'path:', item.path)
    setSelectedPath(item.path)
    
    if (item.isFile && onFileClick) {
      console.log('[FileExplorer] Calling onFileClick callback with path:', item.path)
      onFileClick(item.path)
    }
  }

  const getFileIcon = (name: string, isDirectory: boolean) => {
    if (isDirectory) return '📁'
    const ext = name.split('.').pop()?.toLowerCase()
    const iconMap: Record<string, string> = {
      js: '📜', ts: '📜', jsx: '⚛️', tsx: '⚛️',
      md: '📝', txt: '📄', json: '🔧',
      py: '🐍', go: '🐹', rs: '🦀',
      html: '🌐', css: '🎨', scss: '🎨',
      java: '☕', c: '🔵', cpp: '🔵',
    }
    return iconMap[ext || ''] || '📄'
  }

  const renderTreeNode = (nodes: TreeNode[], path: number[], depth: number = 0) => {
    return nodes.map((node, index) => {
      const currentPath = [...path, index]
      const isSelected = selectedPath === node.path
      
      return (
        <div key={node.path}>
          <div
            onClick={() => {
              if (node.isDirectory) {
                toggleDirectory(node, currentPath)
              } else {
                handleItemClick(node)
              }
            }}
            style={{
              padding: '6px 8px',
              paddingLeft: `${8 + depth * 16}px`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isSelected ? '#000' : 'transparent',
              color: isSelected ? '#fff' : '#000',
              fontSize: '12px',
              fontWeight: 600,
              userSelect: 'none',
              borderLeft: isSelected ? '4px solid #000' : '4px solid transparent',
              borderBottom: '1px solid #f5f5f5',
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {/* Expand/Collapse arrow for directories */}
            {node.isDirectory && (
              <span style={{ 
                width: '14px', 
                textAlign: 'center',
                transition: 'transform 0.15s',
                transform: node.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                fontWeight: 900,
                color: '#000',
              }}>
                {node.isLoading ? '⏳' : '▶'}
              </span>
            )}
            {!node.isDirectory && <span style={{ width: '14px' }} />}
            
            {/* Icon */}
            <span style={{ fontSize: '14px' }}>{getFileIcon(node.name, node.isDirectory)}</span>
            
            {/* Name */}
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {node.name}
            </span>
          </div>
          
          {/* Render children if expanded */}
          {node.isDirectory && node.isExpanded && node.children && (
            <div>
              {renderTreeNode(node.children, currentPath, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div style={{ height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Open Folder button */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '3px solid #000', 
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <strong style={{ color: '#fff', fontSize: '12px', flex: 1, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Explorer
        </strong>
        <button
          onClick={handleOpenFolder}
          className="brutalist-button"
          style={{
            padding: '6px 10px',
            backgroundColor: '#fff',
            color: '#000',
            border: '2px solid #fff',
            boxShadow: '2px 2px 0 #000',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.5px',
          }}
        >
          <FolderOpenOutlined />
          Open
        </button>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#fff',
              color: '#000',
              border: '2px solid #fff',
              boxShadow: '2px 2px 0 #000',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 900,
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)'
              e.currentTarget.style.boxShadow = '1px 1px 0 #000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '2px 2px 0 #000'
            }}
            title="Close panel"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Tree view */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {!rootPath ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#000', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ 
              padding: '20px', 
              border: '3px dashed #000', 
              backgroundColor: '#f5f5f5',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              📁 No folder
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#666', textTransform: 'none' }}>
                Click "OPEN" to start
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Root path display */}
            <div style={{
              padding: '10px 16px',
              color: '#000',
              fontSize: '11px',
              backgroundColor: '#f5f5f5',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: '2px solid #000',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {rootPath.split('/').pop() || rootPath}
            </div>
            
            {/* Tree nodes */}
            {renderTreeNode(treeData, [])}
          </>
        )}
      </div>
    </div>
  )
}
