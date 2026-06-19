/**
 * AI API Configuration - Centralized config for NyxIDE AI Agent
 * 
 * Endpoint: OpenAI-compatible API
 * Model: Gemini 3.1 Pro Preview via gateway
 */

export const AI_CONFIG = {
  // API Endpoint & Authentication (Development with Proxy)
  baseURL: '/api/v1',
  apiKey: 'sk-7c385384dc41adf3-8s0uu8-02500fae',
  model: 'cx/gpt-5.5',
  
  // Request settings
  maxTokens: 4096,
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
  
  // System prompt
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
} = AI_CONFIG

export default AI_CONFIG
