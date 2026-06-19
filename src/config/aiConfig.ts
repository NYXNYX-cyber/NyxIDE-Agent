/**
 * AI API Configuration - Centralized config for NyxIDE AI Agent
 * 
 * Endpoint: OpenAI-compatible API
 * Models: Multiple models available via gateway
 */

export const AVAILABLE_MODELS = [
  { id: 'cx/gpt-5.5', name: 'GPT-5.5', description: 'Fast and capable (default)' },
  { id: 'gc/gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', description: 'Google latest (may have limits)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Advanced reasoning' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI flagship' },
]

export const AI_CONFIG = {
  // API Endpoint & Authentication (Development with Proxy)
  baseURL: '/api/v1',
  apiKey: 'sk-7c385384dc41adf3-8s0uu8-02500fae',
  model: 'cx/gpt-5.5', // Default model
  
  // Request settings
  maxTokens: 8192, // Increased from 4096 for more detailed responses
  temperature: 0.7,
  topP: 0.95,
  
  // Streaming settings
  stream: true,
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 1000, // ms (exponential backoff: 1s, 2s, 4s)
  
  // Context window settings
  maxContextMessages: 20, // Keep last 20 messages for context
  maxTokensPerMessage: 2000, // Limit per message
  
  // System prompt builder (accepts working directory)
  getSystemPrompt: (workingDir?: string) => {
    let prompt = `You are NyxIDE Assistant, an AI coding helper integrated into a desktop IDE.

Your capabilities:
- Read and edit files in the user's project
- Execute bash commands in the integrated terminal
- Search codebase and analyze code
- Help with debugging, refactoring, and code generation
- Explain concepts and provide documentation

Always be helpful, concise, and provide actionable suggestions. When making code changes, show the specific lines or sections that need to be modified.

Current context: You are running inside NyxIDE, a desktop IDE with Monaco Editor, file explorer, and integrated terminal.

IMPORTANT: When using file tools (readFile, writeFile, createFile, deleteFile, listDirectory), ALWAYS use absolute paths. When the user refers to "this folder" or "the project", use the working directory below.`

    if (workingDir) {
      prompt += `\n\n**Current Working Directory:** \`${workingDir}\`
This is the base folder for all file operations. When the user asks to "list files", "show files", "check what's in the folder", or any similar request, use this path: \`${workingDir}\`

Examples:
- User: "List files in this folder" → Use listDirectory with path: "${workingDir}"
- User: "Read the main file" → Use readFile with path: "${workingDir}/<filename>"
- User: "Create a new file" → Use createFile with path: "${workingDir}/<filename>"
- User: "What files are here?" → Use listDirectory with path: "${workingDir}"

NEVER use "/" or "/home" as the default path. Always use the working directory unless the user specifies a different absolute path.`
    }

    return prompt
  },
  
  // Legacy system prompt (without working directory)
  systemPrompt: `You are NyxIDE Assistant, an AI coding helper integrated into a desktop IDE.

Your capabilities:
- Read and edit files in the user's project
- Execute bash commands in the integrated terminal
- Search codebase and analyze code
- Help with debugging, refactoring, and code generation
- Explain concepts and provide documentation

Always be helpful, concise, and provide actionable suggestions. When making code changes, show the specific lines or sections that need to be modified.

Current context: You are running inside NyxIDE, a desktop IDE with Monaco Editor, file explorer, and integrated terminal.`,
}

// Export individual configs for easy import
export const {
  baseURL,
  apiKey,
  model,
  maxTokens,
  temperature,
  stream,
  maxRetries,
  retryDelay,
  maxContextMessages,
  systemPrompt,
  getSystemPrompt,
} = AI_CONFIG

export default AI_CONFIG
