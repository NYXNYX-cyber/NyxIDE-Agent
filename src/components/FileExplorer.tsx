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
}

interface TreeNode extends FileItem {
  children?: TreeNode[]
  isLoading?: boolean
  isExpanded?: boolean
}

export default function FileExplorer({ onFileClick }: FileExplorerProps) {
  const [rootPath, setRootPath] = useState<string>('')
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string>('')

  // Load root directory when rootPath changes
  useEffect(() => {
    if (rootPath) {
      loadDirectory(rootPath).then(items => {
        setTreeData(items)
      })
    }
  }, [rootPath])

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
    try {
      const result = await (window as any).nyxide.openFolderDialog()
      if (result.success && result.path) {
        setRootPath(result.path)
      }
    } catch (error) {
      console.error('Error opening folder:', error)
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
    setSelectedPath(item.path)
    if (item.isFile && onFileClick) {
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
              padding: '4px 8px',
              paddingLeft: `${8 + depth * 16}px`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isSelected ? '#094771' : 'transparent',
              color: '#fff',
              fontSize: '13px',
              userSelect: 'none',
              borderLeft: isSelected ? '2px solid #007acc' : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = '#2a2d2e'
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
                width: '16px', 
                textAlign: 'center',
                transition: 'transform 0.2s',
                transform: node.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}>
                {node.isLoading ? '⏳' : '▶'}
              </span>
            )}
            {!node.isDirectory && <span style={{ width: '16px' }} />}
            
            {/* Icon */}
            <span>{getFileIcon(node.name, node.isDirectory)}</span>
            
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
    <div style={{ height: '100%', backgroundColor: '#252526', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Open Folder button */}
      <div style={{ 
        padding: '8px 12px', 
        borderBottom: '1px solid #3c3c3c', 
        backgroundColor: '#252526',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <strong style={{ color: '#fff', fontSize: '12px', flex: 1 }}>EXPLORER</strong>
        <button
          onClick={handleOpenFolder}
          style={{
            padding: '4px 8px',
            backgroundColor: '#0e639c',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1177bb')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0e639c')}
        >
          <FolderOpenOutlined />
          Open Folder
        </button>
      </div>
      
      {/* Tree view */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {!rootPath ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
            <p>No folder opened</p>
            <p style={{ marginTop: '8px' }}>Click "Open Folder" to start</p>
          </div>
        ) : (
          <>
            {/* Root path display */}
            <div style={{
              padding: '4px 8px',
              color: '#fff',
              fontSize: '12px',
              backgroundColor: '#37373d',
              fontWeight: 600,
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
