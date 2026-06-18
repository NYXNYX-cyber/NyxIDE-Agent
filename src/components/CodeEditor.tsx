import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { getSnippetsForLanguage } from '../utils/snippets'

interface CodeEditorProps {
  filePath: string
  content?: string
  language?: string
  onChange?: (value: string) => void
  onSave?: () => void
}

export default function CodeEditor({ 
  filePath, 
  content = '', 
  language,
  onChange,
  onSave,
}: CodeEditorProps) {
  const [editorContent, setEditorContent] = useState(content)
  const [detectedLanguage, setDetectedLanguage] = useState(language || 'plaintext')

  // Auto-detect language from file extension
  useEffect(() => {
    if (!language && filePath) {
      const ext = filePath.split('.').pop()?.toLowerCase()
      const langMap: Record<string, string> = {
        // JavaScript/TypeScript
        js: 'javascript',
        jsx: 'javascript',
        mjs: 'javascript',
        cjs: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        mts: 'typescript',
        cts: 'typescript',
        
        // Python
        py: 'python',
        pyw: 'python',
        pyi: 'python',
        
        // PHP
        php: 'php',
        phtml: 'php',
        php3: 'php',
        php4: 'php',
        php5: 'php',
        php7: 'php',
        phps: 'php',
        
        // Ruby
        rb: 'ruby',
        erb: 'ruby',
        gemspec: 'ruby',
        
        // Go
        go: 'go',
        
        // Rust
        rs: 'rust',
        
        // Java/Kotlin
        java: 'java',
        kt: 'kotlin',
        kts: 'kotlin',
        
        // C/C++
        c: 'c',
        cpp: 'cpp',
        cc: 'cpp',
        cxx: 'cpp',
        h: 'c',
        hpp: 'cpp',
        hxx: 'cpp',
        
        // C#
        cs: 'csharp',
        
        // Web
        html: 'html',
        htm: 'html',
        xhtml: 'html',
        css: 'css',
        scss: 'scss',
        sass: 'scss',
        less: 'less',
        
        // Data formats
        json: 'json',
        jsonc: 'json',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml',
        toml: 'toml',
        ini: 'ini',
        conf: 'ini',
        
        // Markdown/Documentation
        md: 'markdown',
        markdown: 'markdown',
        rst: 'restructuredtext',
        tex: 'latex',
        
        // Shell/Scripts
        sh: 'shell',
        bash: 'shell',
        zsh: 'shell',
        fish: 'shell',
        ps1: 'powershell',
        psm1: 'powershell',
        bat: 'bat',
        cmd: 'bat',
        
        // SQL
        sql: 'sql',
        mysql: 'sql',
        pgsql: 'sql',
        sqlite: 'sql',
        
        // Other languages
        perl: 'perl',
        pl: 'perl',
        lua: 'lua',
        r: 'r',
        swift: 'swift',
        dart: 'dart',
        scala: 'scala',
        clj: 'clojure',
        ex: 'elixir',
        exs: 'elixir',
        erl: 'erlang',
        hs: 'haskell',
        ml: 'ocaml',
        fs: 'fsharp',
        vb: 'vb',
        groovy: 'groovy',
        coffee: 'coffeescript',
        
        // Config files
        dockerfile: 'dockerfile',
        makefile: 'makefile',
        gitignore: 'plaintext',
        env: 'plaintext',
      }
      setDetectedLanguage(langMap[ext || ''] || 'plaintext')
    }
  }, [filePath, language])

  // Update content when file changes
  useEffect(() => {
    setEditorContent(content)
  }, [content, filePath])

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || ''
    setEditorContent(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleEditorMount = (editor: any, monaco: any) => {
    // Add Ctrl+S save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave()
      }
    })
    
    // Add Ctrl+Shift+I format document shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
    
    // Register snippets for the current language
    // Wait a bit for language detection to complete
    setTimeout(() => {
      const currentLang = detectedLanguage || 'plaintext'
      console.log('[CodeEditor] Detected language:', currentLang, 'File:', filePath)
      
      const snippets = getSnippetsForLanguage(currentLang)
      
      if (snippets.length > 0) {
        monaco.languages.registerCompletionItemProvider(currentLang, {
          triggerCharacters: ['!', '<', '/', '.', '$', '@', '#'],
          provideCompletionItems: (model: any, position: any) => {
            const lineContent = model.getLineContent(position.lineNumber)
            
            // Detect character at cursor position
            const charAtCursorIndex = lineContent.indexOf(lineContent.substr(0, position.column).slice(-1), Math.max(0, position.column - 2))
            const textBeforeCursor = lineContent.substring(0, Math.max(0, position.column - 1))
            const charBeforeCursor = textBeforeCursor.slice(-1)
            
            const isTriggerChar = ['!', '<', '/', '.', '$', '@', '#'].includes(charBeforeCursor)
            
            console.log(`[Snippet] Char before cursor: "${charBeforeCursor}", isTrigger: ${isTriggerChar}`)
            
            // Calculate range: include trigger character if present
            const startColumn = isTriggerChar ? Math.max(1, position.column - 1) : position.column
            
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: startColumn,
              endColumn: position.column,
            }
            
            const suggestions = snippets.map((snippet) => ({
              label: snippet.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snippet.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: snippet.documentation,
              range: range,
              sortText: snippet.sortText || '0' + snippet.label,
              detail: 'Snippet',
              filterText: snippet.label,
              // Remove trigger character if it exists - GLOBAL FIX!
              additionalTextEdits: isTriggerChar ? [{
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: startColumn,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
                text: '',
              }] : undefined,
            }))
            
            return { suggestions }
          },
        })
        
        console.log(`[CodeEditor] Registered ${snippets.length} snippets for ${currentLang}`)
      } else {
        console.log(`[CodeEditor] No snippets registered for ${currentLang}`)
      }
    }, 100)
    
    // Configure editor options
    editor.updateOptions({
      // Font settings
      fontSize: 14,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontLigatures: true,
      
      // Minimap
      minimap: { 
        enabled: true,
        maxColumn: 120,
        renderCharacters: false,
        showSlider: 'mouseover',
      },
      
      // Scrolling
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      mouseWheelScrollSensitivity: 1.5,
      
      // Layout
      automaticLayout: true,
      wordWrap: 'on',
      wordWrapColumn: 120,
      
      // Line numbers
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      renderLineHighlight: 'all',
      renderWhitespace: 'selection',
      
      // Code folding
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      foldingHighlight: true,
      
      // Bracket matching
      matchBrackets: 'always',
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      
      // Indentation
      autoIndent: 'full',
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true,
      
      // Formatting
      formatOnPaste: true,
      formatOnType: true,
      
      // Autocomplete/IntelliSense
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top', // Show snippets at top of suggestions
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showWords: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showConstructors: true,
        showFields: true,
        showMethods: true,
        showInterfaces: true,
      },
      
      // Parameter hints
      parameterHints: {
        enabled: true,
        cycle: true,
      },
      
      // Hover
      hover: {
        enabled: true,
        delay: 300,
        sticky: true,
      },
      
      // Links
      links: true,
      
      // Cursor
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      cursorSurroundingLines: 5,
      
      // Miscellaneous
      renderControlCharacters: true,
      renderFinalNewline: 'on',
      showUnused: true,
      occurrencesHighlight: 'singleFile',
      selectionHighlight: true,
    })
    
    // Add context menu action for format document
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],
      contextMenuGroupId: '1_modification',
      contextMenuOrder: 1.5,
      run: (ed: any) => {
        ed.getAction('editor.action.formatDocument')?.run()
      },
    })
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor
        height="100%"
        language={detectedLanguage}
        value={editorContent}
        theme="vs-dark"
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  )
}
