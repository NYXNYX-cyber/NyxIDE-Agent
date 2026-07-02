import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface Tab {
  path: string
  name: string
  modified: boolean
  content: string
  originalContent: string
}

interface AppState {
  tabs: Tab[]
  activeTabPath: string | null
  openFile: (path: string) => Promise<void>
  closeFile: (path: string) => Promise<boolean>
  setActiveTab: (path: string) => void
  updateFileContent: (path: string, content: string) => void
  saveFile: (path: string) => Promise<boolean>
  isFileModified: (path: string) => boolean
  refreshTab: (path: string) => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabPath, setActiveTabPath] = useState<string | null>(null)

  const openFile = useCallback(async (path: string) => {
    console.log('[AppContext] Opening file:', path)
    
    // Check if file already open
    const existingTab = tabs.find(tab => tab.path === path)
    if (existingTab) {
      console.log('[AppContext] File already open, switching to tab')
      setActiveTabPath(path)
      return
    }

    // Load file content
    try {
      console.log('[AppContext] Loading file content via IPC...')
      const result = await (window as any).nyxide.readFile(path)
      console.log('[AppContext] IPC result:', result)
      
      if (result.success) {
        const newTab: Tab = {
          path,
          name: path.split('/').pop() || 'Untitled',
          modified: false,
          content: result.content,
          originalContent: result.content,
        }
        console.log('[AppContext] Adding new tab:', newTab.name)
        setTabs(prev => [...prev, newTab])
        setActiveTabPath(path)
      } else {
        console.error('[AppContext] Failed to open file:', result.error)
        alert(`Failed to open file: ${result.error}`)
      }
    } catch (error) {
      console.error('[AppContext] Error opening file:', error)
      alert(`Error opening file: ${error}`)
    }
  }, [tabs])

  const closeFile = useCallback(async (path: string): Promise<boolean> => {
    const tab = tabs.find(t => t.path === path)
    
    // Check for unsaved changes
    if (tab && tab.modified) {
      const confirmClose = window.confirm(
        `"${tab.name}" has unsaved changes. Do you want to save before closing?`
      )
      if (confirmClose) {
        const saved = await saveFile(path)
        if (!saved) return false
      }
    }

    setTabs(prev => prev.filter(t => t.path !== path))
    
    // Switch to another tab if closing active tab
    if (activeTabPath === path) {
      const remainingTabs = tabs.filter(t => t.path !== path)
      if (remainingTabs.length > 0) {
        setActiveTabPath(remainingTabs[remainingTabs.length - 1].path)
      } else {
        setActiveTabPath(null)
      }
    }
    
    return true
  }, [tabs, activeTabPath])

  const updateFileContent = useCallback((path: string, content: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.path === path) {
        const modified = content !== tab.originalContent
        return { ...tab, content, modified }
      }
      return tab
    }))
  }, [])

  const saveFile = useCallback(async (path: string): Promise<boolean> => {
    const tab = tabs.find(t => t.path === path)
    if (!tab) return false

    try {
      const result = await (window as any).nyxide.writeFile(path, tab.content)
      if (result.success) {
        setTabs(prev => prev.map(t => {
          if (t.path === path) {
            return { ...t, modified: false, originalContent: t.content }
          }
          return t
        }))
        return true
      } else {
        console.error('Failed to save file:', result.error)
        alert(`Failed to save file: ${result.error}`)
        return false
      }
    } catch (error) {
      console.error('Error saving file:', error)
      alert(`Error saving file: ${error}`)
      return false
    }
  }, [tabs])

  const isFileModified = useCallback((path: string): boolean => {
    const tab = tabs.find(t => t.path === path)
    return tab?.modified || false
  }, [tabs])

  const refreshTab = useCallback(async (path: string): Promise<void> => {
    console.log('[AppContext] Refreshing tab from disk:', path)
    const tab = tabs.find(t => t.path === path)
    if (!tab) {
      console.log('[AppContext] Tab not found, skipping refresh')
      return
    }

    try {
      const result = await (window as any).nyxide.readFile(path)
      if (result.success) {
        console.log('[AppContext] File content refreshed, updating tab')
        setTabs(prev => prev.map(t => {
          if (t.path === path) {
            return { 
              ...t, 
              content: result.content, 
              originalContent: result.content,
              modified: false 
            }
          }
          return t
        }))
      } else {
        console.error('[AppContext] Failed to refresh tab:', result.error)
      }
    } catch (error) {
      console.error('[AppContext] Error refreshing tab:', error)
    }
  }, [tabs])

  // Expose openFile and refreshTab to window for chat panel to use
  useEffect(() => {
    Object.assign(window, { 
      nyxideRefreshTab: refreshTab,
      nyxideOpenFile: openFile
    })
    return () => {
      delete (window as any).nyxideRefreshTab
      delete (window as any).nyxideOpenFile
    }
  }, [refreshTab, openFile])

  return (
    <AppContext.Provider value={{
      tabs,
      activeTabPath,
      openFile,
      closeFile,
      setActiveTab: setActiveTabPath,
      updateFileContent,
      saveFile,
      isFileModified,
      refreshTab,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used within AppProvider')
  }
  return context
}
