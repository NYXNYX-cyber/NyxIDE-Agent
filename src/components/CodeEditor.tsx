import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

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
    // Save shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) { onSave() }
    })
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
    
    // Register HTML snippets - UNCONDITIONAL (fix race condition)
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordAtPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word ? word.startColumn : position.column,
          endColumn: word ? word.endColumn : position.column,
        }

        const suggestions = [
          {
            label: 'h1',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<h1>${1:Heading 1}</h1>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Heading 1',
            range,
          },
          {
            label: 'h2',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<h2>${1:Heading 2}</h2>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Heading 2',
            range,
          },
          {
            label: 'h3',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<h3>${1:Heading 3}</h3>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Heading 3',
            range,
          },
          {
            label: 'p',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<p>${1:Paragraph}</p>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Paragraph',
            range,
          },
          {
            label: 'div',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<div>${1}</div>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Div element',
            range,
          },
          {
            label: 'span',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<span>${1}</span>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Span element',
            range,
          },
          {
            label: 'ul',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<ul>\n  <li>${1}</li>\n</ul>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Unordered list',
            range,
          },
          {
            label: 'ol',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<ol>\n  <li>${1}</li>\n</ol>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Ordered list',
            range,
          },
          {
            label: 'li',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<li>${1}</li>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'List item',
            range,
          },
          {
            label: 'a',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<a href="${1}">${2:Link}</a>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Anchor link',
            range,
          },
          {
            label: 'img',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<img src="${1}" alt="${2}" />',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Image',
            range,
          },
          {
            label: 'button',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<button>${1:Click me}</button>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Button',
            range,
          },
          {
            label: 'form',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<form action="${1}" method="${2:post}">\n  ${3}\n</form>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Form',
            range,
          },
          {
            label: 'input',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<input type="${1:text}" name="${2}" />',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Input field',
            range,
          },
          {
            label: 'table',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<table>\n  <thead>\n    <tr>\n      <th>${1}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>${2}</td>\n    </tr>\n  </tbody>\n</table>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Table',
            range,
          },
          {
            label: 'html5',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${2}\n</body>\n</html>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'HTML5 boilerplate',
            range,
          },
          {
            label: '!',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${2}\n</body>\n</html>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'HTML5 boilerplate',
            range,
          },
        ]

        return { suggestions }
      },
    })

    console.log('[CodeEditor] ✅ HTML snippets registered (unconditional)')
    
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
