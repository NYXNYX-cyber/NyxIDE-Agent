import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

interface TerminalProps {
  visible: boolean
}

export default function Terminal({ visible }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#cccccc',
      },
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    
    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Welcome message
    term.writeln('\x1b[1;32mNyxIDE Terminal v0.1.0\x1b[0m')
    term.writeln('\x1b[90mType "help" for available commands\x1b[0m')
    term.writeln('')

    // Handle terminal input
    let currentLine = ''
    
    term.onData((data) => {
      if (data === '\r') {
        // Enter key
        term.write('\r\n')
        
        if (currentLine.trim()) {
          // Execute command via IPC
          executeCommand(currentLine.trim(), term)
        } else {
          // Empty command, just show prompt
          term.write('\x1b[1;34m$\x1b[0m ')
        }
        
        currentLine = ''
      } else if (data === '\x7f') {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          term.write('\b \b')
        }
      } else if (data === '\x03') {
        // Ctrl+C
        term.write('^C\r\n')
        currentLine = ''
        term.write('\x1b[1;34m$\x1b[0m ')
      } else {
        // Regular character
        currentLine += data
        term.write(data)
      }
    })

    // Show initial prompt
    term.write('\x1b[1;34m$\x1b[0m ')

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
      xtermRef.current = null
      fitAddonRef.current = null
    }
  }, [])

  useEffect(() => {
    // Fit terminal when visibility changes
    if (visible && fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit()
      }, 100)
    }
  }, [visible])

  const executeCommand = async (command: string, term: XTerm) => {
    try {
      // Handle built-in commands
      if (command === 'help') {
        term.writeln('\x1b[1;33mAvailable commands:\x1b[0m')
        term.writeln('  help          - Show this help message')
        term.writeln('  clear         - Clear terminal')
        term.writeln('  echo <text>   - Echo text')
        term.writeln('  date          - Show current date/time')
        term.writeln('  whoami        - Show current user')
        term.writeln('  pwd           - Print working directory')
        term.writeln('  ls            - List directory contents')
        term.writeln('  exit          - Close terminal')
        term.writeln('')
        term.write('\x1b[1;34m$\x1b[0m ')
        return
      }

      if (command === 'clear') {
        term.clear()
        term.write('\x1b[1;34m$\x1b[0m ')
        return
      }

      if (command === 'exit') {
        term.writeln('\x1b[90mTerminal closed. Press Ctrl+` to reopen.\x1b[0m')
        return
      }

      // Execute via IPC
      const result = await (window as any).nyxide.execCommand(command)
      
      if (result.success) {
        if (result.stdout) {
          term.writeln(result.stdout)
        }
        if (result.stderr && !result.stdout) {
          term.writeln(`\x1b[31m${result.stderr}\x1b[0m`)
        }
      } else {
        term.writeln(`\x1b[31mError: ${result.error || 'Command failed'}\x1b[0m`)
      }
      
      term.write('\x1b[1;34m$\x1b[0m ')
    } catch (error: any) {
      term.writeln(`\x1b[31mError: ${error.message}\x1b[0m`)
      term.write('\x1b[1;34m$\x1b[0m ')
    }
  }

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    />
  )
}
