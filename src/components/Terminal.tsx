import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

interface TerminalProps {
  visible: boolean
  cwd?: string  // Working directory from Explorer
}

export default function Terminal({ visible, cwd }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const ptyIdRef = useRef<string>('')
  const ptyProcessReady = useRef<boolean>(false)

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    let resizeHandler: (() => void) | null = null

    const initTerminal = async () => {
      if (!terminalRef.current) return

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
        scrollback: 10000, // Increased scrollback
      })

      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      
      // Open terminal
      term.open(terminalRef.current!)
      
      // Fit after a small delay to ensure dimensions are available
      setTimeout(() => {
        try {
          fitAddon.fit()
        } catch (error) {
          console.error('Failed to fit terminal:', error)
        }
      }, 50)

      xtermRef.current = term
      fitAddonRef.current = fitAddon

      // Welcome message
      term.writeln('\x1b[1;32mNyxIDE Terminal v0.1.0\x1b[0m')
      term.writeln('\x1b[90mType "help" for available commands\x1b[0m')
      term.writeln('')

      // Setup shell mode - no command parsing needed
      // Just forward all input to PTY
      term.onData((data) => {
        if (ptyIdRef.current && ptyProcessReady.current) {
          ;(window as any).nyxide.ptyWrite(ptyIdRef.current, data)
        } else {
          term.write('\x1b[1;33mWaiting for terminal...\x1b[0m\r\n')
        }
      })

      // Handle resize
      resizeHandler = () => {
        if (fitAddonRef.current && ptyIdRef.current) {
          setTimeout(() => {
            try {
              fitAddonRef.current?.fit()
              const cols = term.cols
              const rows = term.rows
              ;(window as any).nyxide.ptyResize(ptyIdRef.current, cols, rows)
            } catch (error) {
              console.error('Failed to fit terminal on resize:', error)
            }
          }, 50)
        }
      }

      window.addEventListener('resize', resizeHandler)

      // Create PTY process
      try {
        const result = await (window as any).nyxide.ptyCreate({
          cwd: cwd || undefined,
          cols: term.cols,
          rows: term.rows,
        })
        
        if (result.success) {
          ptyIdRef.current = result.id
          ptyProcessReady.current = true
          term.write('\r\n')
          
          // Listen to PTY data
          ;(window as any).nyxide.onPtyData((payload) => {
            if (payload.id === ptyIdRef.current) {
              term.write(payload.data)
            }
          })
          
          // Listen to PTY exit
          ;(window as any).nyxide.onPtyExit((payload) => {
            if (payload.id === ptyIdRef.current) {
              term.write(`\r\nPTY exited with code ${payload.exitCode}\r\n`)
              ptyProcessReady.current = false
            }
          })
        } else {
          term.writeln(`\x1b[31mError creating PTY: ${result.error}\x1b[0m`)
        }
      } catch (error: any) {
        term.writeln(`\x1b[31mError: ${error.message}\x1b[0m`)
      }
    }

    // Initialize after a small delay
    const timeoutId = setTimeout(initTerminal, 100)

    return () => {
      clearTimeout(timeoutId)
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
      }
      if (xtermRef.current) {
        xtermRef.current.dispose()
        xtermRef.current = null
        fitAddonRef.current = null
      }
      // Clean up PTY
      if (ptyIdRef.current) {
        ;(window as any).nyxide.ptyKill(ptyIdRef.current)
        ptyIdRef.current = ''
      }
    }
  }, [])

  useEffect(() => {
    // Fit terminal when visibility changes
    if (visible && fitAddonRef.current) {
      setTimeout(() => {
        try {
          fitAddonRef.current?.fit()
        } catch (error) {
          console.error('Failed to fit terminal on visibility change:', error)
        }
      }, 150)
    }
  }, [visible])

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
