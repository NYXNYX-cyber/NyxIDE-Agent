/**
 * File Tools - AI-callable tools for file operations
 * 
 * These tools can be invoked by the AI agent to read, write, create, delete files
 * and list directories. All operations go through Electron IPC for security.
 */

import { tool } from 'ai'
import { z } from 'zod'

// Type for file operation results
interface FileOperationResult {
  success: boolean
  content?: string
  files?: string[]
  error?: string
}

// Helper to access nyxide API from window
const getNyxideAPI = () => {
  if (typeof window === 'undefined' || !(window as any).nyxide) {
    throw new Error('NyxIDE API not available. Make sure app is running in Electron.')
  }
  return (window as any).nyxide
}

/**
 * Read file content
 */
export const readFile = tool({
  description: 'Read the content of a file at the specified path. Returns the file content as a string.',
  parameters: z.object({
    path: z.string().describe('Absolute file path to read (e.g., /home/user/project/file.txt)'),
  }),
  execute: async ({ path }) => {
    console.log('[FileTools] Reading file:', path)
    try {
      const api = getNyxideAPI()
      const result: FileOperationResult = await api.readFile(path)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }
      
      return {
        success: true,
        path,
        content: result.content,
        lineCount: result.content?.split('\n').length || 0,
      }
    } catch (error: any) {
      console.error('[FileTools] Error reading file:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * Write file content with diff preview
 */
export const writeFile = tool({
  description: 'Write new content to an existing file. This will show a diff preview before applying changes.',
  parameters: z.object({
    path: z.string().describe('Absolute file path to write to'),
    content: z.string().describe('New content to write to the file'),
  }),
  execute: async ({ path, content }) => {
    console.log('[FileTools] Writing file:', path)
    try {
      const api = getNyxideAPI()
      
      // Read old content first for diff preview
      const oldResult: FileOperationResult = await api.readFile(path)
      const oldContent = oldResult.success ? (oldResult.content || '') : ''
      
      // Write new content
      const writeResult: FileOperationResult = await api.writeFile(path, content)
      
      if (!writeResult.success) {
        return { success: false, error: writeResult.error }
      }
      
      return {
        success: true,
        path,
        oldContent,
        newContent: content,
        needsApproval: true,
        message: `File will be modified. Review changes in the diff viewer.`,
      }
    } catch (error: any) {
      console.error('[FileTools] Error writing file:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * Create a new file
 */
export const createFile = tool({
  description: 'Create a new file at the specified path with optional initial content.',
  parameters: z.object({
    path: z.string().describe('Absolute file path to create'),
    content: z.string().optional().describe('Initial content for the new file (optional)'),
  }),
  execute: async ({ path, content = '' }) => {
    console.log('[FileTools] Creating file:', path)
    try {
      const api = getNyxideAPI()
      const result: FileOperationResult = await api.createFile(path, content)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }
      
      return {
        success: true,
        path,
        message: `File created successfully at ${path}`,
        lineCount: content.split('\n').length,
      }
    } catch (error: any) {
      console.error('[FileTools] Error creating file:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * Delete a file
 */
export const deleteFile = tool({
  description: 'Delete a file at the specified path. This action cannot be undone.',
  parameters: z.object({
    path: z.string().describe('Absolute file path to delete'),
  }),
  execute: async ({ path }) => {
    console.log('[FileTools] Deleting file:', path)
    try {
      const api = getNyxideAPI()
      const result: FileOperationResult = await api.deleteFile(path)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }
      
      return {
        success: true,
        path,
        message: `File deleted successfully: ${path}`,
      }
    } catch (error: any) {
      console.error('[FileTools] Error deleting file:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * List directory contents
 */
export const listDirectory = tool({
  description: 'List all files and folders in a directory. Returns an array of file/folder names with metadata.',
  parameters: z.object({
    path: z.string().describe('Absolute directory path to list'),
  }),
  execute: async ({ path }) => {
    console.log('[FileTools] Listing directory:', path)
    try {
      const api = getNyxideAPI()
      const result = await api.listDirectory(path)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }
      
      // IPC returns { items: [{name, isDirectory, isFile}] }
      const items = result.items || []
      
      return {
        success: true,
        path,
        items: items.map((item: any) => ({
          name: item.name,
          type: item.isDirectory ? 'directory' : 'file',
          isDirectory: item.isDirectory,
          isFile: item.isFile,
        })),
        count: items.length,
        message: `Found ${items.length} items in ${path}`,
      }
    } catch (error: any) {
      console.error('[FileTools] Error listing directory:', error)
      return { success: false, error: error.message }
    }
  },
})

// Export all tools as an object for easy integration with AI SDK
export const fileTools = {
  readFile,
  writeFile,
  createFile,
  deleteFile,
  listDirectory,
}

export default fileTools
