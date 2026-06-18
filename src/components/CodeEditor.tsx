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
        js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
        ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript',
        py: 'python', pyw: 'python', pyi: 'python',
        php: 'php', phtml: 'php', php3: 'php', php4: 'php', php5: 'php', php7: 'php', phps: 'php',
        rb: 'ruby', erb: 'ruby', gemspec: 'ruby',
        go: 'go',
        rs: 'rust',
        java: 'java', kt: 'kotlin', kts: 'kotlin',
        c: 'c', cpp: 'cpp', cc: 'cpp', cxx: 'cpp', h: 'c', hpp: 'cpp', hxx: 'cpp',
        cs: 'csharp',
        html: 'html', htm: 'html', xhtml: 'html',
        css: 'css', scss: 'scss', sass: 'scss', less: 'less',
        json: 'json', jsonc: 'json', xml: 'xml',
        yaml: 'yaml', yml: 'yaml', toml: 'toml', ini: 'ini', conf: 'ini',
        md: 'markdown', markdown: 'markdown', rst: 'restructuredtext', tex: 'latex',
        sh: 'shell', bash: 'shell', zsh: 'shell', fish: 'shell',
        ps1: 'powershell', psm1: 'powershell', bat: 'bat', cmd: 'bat',
        sql: 'sql', mysql: 'sql', pgsql: 'sql', sqlite: 'sql',
        perl: 'perl', pl: 'perl', lua: 'lua', r: 'r', swift: 'swift', dart: 'dart',
        scala: 'scala', clj: 'clojure', ex: 'elixir', exs: 'elixir', erl: 'erlang',
        hs: 'haskell', ml: 'ocaml', fs: 'fsharp', vb: 'vb', groovy: 'groovy', coffee: 'coffeescript',
        dockerfile: 'dockerfile', makefile: 'makefile', gitignore: 'plaintext', env: 'plaintext',
      }
      setDetectedLanguage(langMap[ext || ''] || 'plaintext')
    }
  }, [filePath, language])

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
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) { onSave() }
    })
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
    
    // === SNIPPET SYSTEM WITH TRIGGER CHARACTER SUPPORT ===
    setTimeout(() => {
      const currentLang = detectedLanguage || 'plaintext'
      const snippets = getSnippetsForLanguage(currentLang)
      
      if (snippets.length > 0) {
        monaco.languages.registerCompletionItemProvider(currentLang, {
          triggerCharacters: ['<', '!', '.', '#', '@', '/', '$'],
          provideCompletionItems: (model: any, position: any) => {
            const lineContent = model.getLineContent(position.lineNumber)
            
            // Detect trigger character
            const charBeforeCursor = lineContent[position.column - 2] || ''
            const triggerChars = ['<', '!', '.', '#', '@', '/', '$']
            const isTriggerChar = triggerChars.includes(charBeforeCursor)
            
            // Calculate range
            let startColumn, endColumn
            if (isTriggerChar) {
              // Include trigger character in range
              startColumn = Math.max(1, position.column - 1)
              endColumn = position.column
            } else {
              // Use word boundary
              const word = model.getWordUntilPosition(position)
              startColumn = word.startColumn
              endColumn = word.endColumn
            }
            
            const suggestions = snippets.map((snippet) => {
              // If trigger char, prepend it to filterText so Monaco can match
              const filterText = isTriggerChar 
                ? charBeforeCursor + snippet.label 
                : snippet.label
              
              return {
                label: snippet.label,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: snippet.insertText,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: snippet.documentation,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn,
                  endColumn,
                },
                sortText: '0' + snippet.label,
                detail: snippet.label,
                filterText: filterText,
              }
            })
            
            return { suggestions }
          },
        })
        
        console.log(`[CodeEditor] ✅ Registered ${snippets.length} snippets for ${currentLang}`)
      } else {
        console.log(`[CodeEditor] ⚠️ No snippets for ${currentLang}`)
      }
    }, 500)
    
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { enabled: true, maxColumn: 120 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      matchBrackets: 'always',
      bracketPairColorization: { enabled: true },
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      quickSuggestions: { other: true, comments: false, strings: false },
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top',
      suggestOnTriggerCharacters: true,
      suggest: {
        showKeywords: true, showSnippets: true, showWords: true,
        showFunctions: true, showVariables: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true, sticky: true },
      cursorBlinking: 'smooth',
    })
    
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],
      contextMenuGroupId: '1_modification',
      run: (ed: any) => ed.getAction('editor.action.formatDocument')?.run(),
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
        options={{ selectOnLineNumbers: true, automaticLayout: true }}
      />
    </div>
  )
}
