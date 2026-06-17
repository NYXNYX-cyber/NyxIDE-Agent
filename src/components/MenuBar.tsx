import { useState, useRef, useEffect } from 'react'

interface MenuBarItemProps {
  label: string
  items: MenuItem[]
}

interface MenuItem {
  label: string
  shortcut?: string
  onClick?: () => void
  divider?: boolean
  disabled?: boolean
}

function MenuBarItem({ label, items }: MenuBarItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick && !item.disabled) {
      item.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => {
          // If any menu is open, hover opens this one
          const anyMenuOpen = document.querySelector('[data-menu-open="true"]')
          if (anyMenuOpen) {
            setIsOpen(true)
          }
        }}
        data-menu-open={isOpen ? 'true' : 'false'}
        style={{
          padding: '4px 12px',
          background: isOpen ? '#094771' : 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'inherit',
          borderRadius: '2px',
        }}
        onMouseOver={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = '#2a2d2e'
          }
        }}
        onMouseOut={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        {label}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '220px',
            background: '#2d2d30',
            border: '1px solid #454545',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            padding: '4px 0',
          }}
        >
          {items.map((item, index) =>
            item.divider ? (
              <div
                key={index}
                style={{
                  height: '1px',
                  background: '#454545',
                  margin: '4px 0',
                }}
              />
            ) : (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                style={{
                  width: '100%',
                  padding: '6px 24px',
                  background: 'transparent',
                  border: 'none',
                  color: item.disabled ? '#6a6a6a' : '#fff',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseOver={(e) => {
                  if (!item.disabled) {
                    e.currentTarget.style.background = '#094771'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span style={{ color: '#888', fontSize: '12px', marginLeft: '20px' }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

interface MenuBarProps {
  onNewFile?: () => void
  onOpenFile?: () => void
  onOpenFolder?: () => void
  onSave?: () => void
  onSaveAll?: () => void
  onCloseTab?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onFind?: () => void
  onReplace?: () => void
  onToggleExplorer?: () => void
  onToggleChat?: () => void
  onToggleTerminal?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
}

export default function MenuBar({
  onNewFile,
  onOpenFile,
  onOpenFolder,
  onSave,
  onSaveAll,
  onCloseTab,
  onUndo,
  onRedo,
  onFind,
  onReplace,
  onToggleExplorer,
  onToggleChat,
  onToggleTerminal,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: MenuBarProps) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const cmdKey = isMac ? '⌘' : 'Ctrl'

  const fileMenu: MenuItem[] = [
    { label: 'New File', shortcut: `${cmdKey}+N`, onClick: onNewFile },
    { label: 'Open File...', shortcut: `${cmdKey}+O`, onClick: onOpenFile },
    { label: 'Open Folder...', shortcut: `${cmdKey}+K ${cmdKey}+O`, onClick: onOpenFolder },
    { divider: true, label: '' },
    { label: 'Save', shortcut: `${cmdKey}+S`, onClick: onSave },
    { label: 'Save All', shortcut: `${cmdKey}+Shift+S`, onClick: onSaveAll },
    { divider: true, label: '' },
    { label: 'Close Tab', shortcut: `${cmdKey}+W`, onClick: onCloseTab },
  ]

  const editMenu: MenuItem[] = [
    { label: 'Undo', shortcut: `${cmdKey}+Z`, onClick: onUndo },
    { label: 'Redo', shortcut: `${cmdKey}+Y`, onClick: onRedo },
    { divider: true, label: '' },
    { label: 'Find', shortcut: `${cmdKey}+F`, onClick: onFind },
    { label: 'Replace', shortcut: `${cmdKey}+H`, onClick: onReplace },
  ]

  const viewMenu: MenuItem[] = [
    { label: 'Toggle Explorer', shortcut: `${cmdKey}+B`, onClick: onToggleExplorer },
    { label: 'Toggle Terminal', shortcut: `${cmdKey}+\``, onClick: onToggleTerminal },
    { label: 'Toggle Chat', shortcut: 'Escape', onClick: onToggleChat },
    { divider: true, label: '' },
    { label: 'Zoom In', shortcut: `${cmdKey}++`, onClick: onZoomIn },
    { label: 'Zoom Out', shortcut: `${cmdKey}+-`, onClick: onZoomOut },
    { label: 'Reset Zoom', shortcut: `${cmdKey}+0`, onClick: onZoomReset },
  ]

  const helpMenu: MenuItem[] = [
    { label: 'Documentation', onClick: () => window.open('https://github.com/NYXNYX-cyber/NyxIDE-Agent', '_blank') },
    { label: 'Report Issue', onClick: () => window.open('https://github.com/NYXNYX-cyber/NyxIDE-Agent/issues', '_blank') },
    { divider: true, label: '' },
    { label: 'About NyxIDE', onClick: () => alert('NyxIDE v0.1.0\nAI-Powered Desktop IDE\nBuilt with Electron + React + Monaco\n\n© 2026 NYXNYX-cyber\nLicensed under Apache 2.0') },
  ]

  return (
    <div
      style={{
        height: '30px',
        background: '#3c3c3c',
        borderBottom: '1px solid #252526',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: '2px',
        WebkitAppRegion: 'no-drag' as any,
      }}
    >
      <MenuBarItem label="File" items={fileMenu} />
      <MenuBarItem label="Edit" items={editMenu} />
      <MenuBarItem label="View" items={viewMenu} />
      <MenuBarItem label="Help" items={helpMenu} />
    </div>
  )
}
