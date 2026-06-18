import { useState } from 'react'
import { Modal, Input, message } from 'antd'

interface NewFileModalProps {
  open: boolean
  defaultPath: string
  onClose: () => void
  onCreateFile: (fileName: string) => void
}

export default function NewFileModal({ open, defaultPath, onClose, onCreateFile }: NewFileModalProps) {
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    if (!fileName.trim()) {
      message.error('File name cannot be empty')
      return
    }

    setLoading(true)
    try {
      await onCreateFile(fileName.trim())
      setFileName('')
      onClose()
    } catch (error) {
      message.error('Failed to create file')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFileName('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOk()
    }
  }

  return (
    <Modal
      title="Create New File"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={loading}
      okButtonProps={{ disabled: !fileName.trim() }}
    >
      <div style={{ marginBottom: 8, color: '#888', fontSize: 12 }}>
        {defaultPath ? `Will be created in: ${defaultPath}` : 'No folder selected'}
      </div>
      <Input
        placeholder="Enter file name (e.g., index.html, script.js)"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={!defaultPath}
      />
      {!defaultPath && (
        <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
          Please open a folder first before creating a new file
        </div>
      )}
    </Modal>
  )
}
