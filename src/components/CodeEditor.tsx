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
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        go: 'go',
        rs: 'rust',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        h: 'c',
        hpp: 'cpp',
        html: 'html',
        css: 'css',
        scss: 'scss',
        json: 'json',
        md: 'markdown',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml',
        sh: 'shell',
        bash: 'shell',
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
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      matchBrackets: 'always',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
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
