/**
 * Type definitions for AI tool calling
 */

export interface Tool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, any>
      required?: string[]
    }
  }
}

export interface ToolCall {
  id: string
  name: string
  arguments: any
  result?: any
}

export interface FileToolResult {
  success: boolean
  path?: string
  content?: string
  oldContent?: string
  newContent?: string
  items?: Array<{ name: string; isDirectory: boolean }>
  error?: string
}
