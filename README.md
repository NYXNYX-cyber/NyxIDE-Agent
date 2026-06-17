# NyxIDE 🚀

**AI-Powered Desktop IDE for Modern Developers**

A standalone IDE with custom AI agent integration, built with Electron and Monaco Editor. Think Cursor/Windsurf but lightweight and cross-platform.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue)](https://github.com/NYXNYX-cyber/NyxIDE-Agent)

## 🎯 What is NyxIDE?

NyxIDE is a **build-in-progress** desktop IDE that combines the familiar coding experience of VS Code with powerful AI agent capabilities:

- 💬 **Chat-first interface** - Natural language development
- 🤖 **AI Agent** - Can read/write files, execute commands, and manage your codebase
- 📝 **Monaco Editor** - Same engine as VS Code with 100+ language support
- 🔧 **Multi-tab editing** - Work on multiple files simultaneously
- ⌨️ **Terminal integrated** - Run commands without leaving the IDE
- 🚀 **Cross-platform** - Windows (.exe) and Linux (AppImage) support

## 📋 Roadmap Status

| Feature | Status | Target |
|---------|--------|--------|
| Project Planning | ✅ Complete | Done |
| Foundation (Window, Monaco, File Tree) | ✅ Complete | Week 1 DONE |
| AI API Integration | ⏳ In Progress | Week 2 |
| Chat Interface & Streaming | ⏳ In Progress | Week 2 |
| Multi-tab Editing | ⏳ Pending | Week 3 |
| Terminal Integration | ⏳ Pending | Week 3 |
| Diff Viewer & Approval Workflow | ⏳ Pending | Week 3 |
| Settings & Polish | ⏳ Pending | Week 4 |
| Cross-platform Build | ⏳ Pending | Week 4 |

**MVP Goal:** 3-4 weeks from initialization

## 🛠️ Tech Stack

- **Desktop Framework:** Electron 28+ (42.4.1)
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 8.0.12
- **Code Editor:** Monaco Editor (via @monaco-editor/react)
- **Terminal:** xterm.js
- **UI Components:** Ant Design
- **State Management:** Zustand (planned)
- **Packaging:** electron-builder 26.15.3

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+ (LTS recommended)
npm
Git
```

### Installation

```bash
# Clone repository
git clone https://github.com/NYXNYX-cyber/NyxIDE-Agent.git
cd NyxIDE-Agent

# Install dependencies
npm install

# Start development mode (Vite dev server + Electron)
npm run dev

# Build production binaries
npm run build
```

### Development Commands

```bash
npm run dev      # Start Vite dev server + Electron window
npm run build    # Build TypeScript + Vite + package for production
npm run lint     # Run ESLint checks
npm run preview  # Preview built production files
```

## 🏗️ Week 1 Implementation Progress

✅ **Foundation Complete!**

- ✅ Electron main process with IPC handlers for file operations
- ✅ Preload script with secure context bridge
- ✅ Split-pane layout (Chat 50%, Editor 50%, File Explorer 280px)
- ✅ File Explorer component (read-only, tree view)
- ✅ Chat panel UI with placeholder AI responses
- ✅ Multi-tab system with close buttons
- ✅ Vite build system configured
- ✅ electron-builder config for Windows .exe & Linux AppImage
- ✅ Production build generating AppImage successfully (108MB)

### Architecture

```
nyxide/
├── src-electron/
│   ├── main.js         # Electron main process + IPC handlers
│   └── preload.js      # Context bridge (security)
├── src/
│   ├── components/
│   │   ├── FileExplorer.tsx    # Directory tree component
│   │   ├── ChatPanel.tsx        # Chat interface
│   │   └── EditorTabs.tsx       # Multi-tab system
│   ├── App.tsx          # Main split-pane layout
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── dist/                # Vite build output
├── release/             # electron-builder output
├── vite.config.ts       # Vite configuration
├── package.json         # Dependencies + electron-builder config
└── tsconfig.json        # TypeScript configuration
```

## 🔑 Configuration

NyxIDE uses an external AI API service. Configure via Settings UI (Week 4):

**Default Endpoint:** `http://localhost:1430/v1`  
**Model:** `kiro/claude-sonnet-4.5-thinking-agentic`  
**Auth:** Bearer token in Authorization header

See [IDE_AGENT_PLANNING.md](./IDE_AGENT_PLANNING.md) for detailed API spec.

## 🎨 Design Philosophy

### Layout
Split 50/50 (chat left, editor right) - inspired by Cursor IDE

### Theme
Dark mode default (VS Code Dark+) with light mode toggle

### UX Priorities
1. **Safety first** - Always confirm destructive operations
2. **Surgical precision** - Agent edits with diff preview, never full rewrites
3. **Transparent AI** - Show model's thinking process separately
4. **Fast startup** - < 3 seconds cold start target
5. **Memory efficient** - < 500MB RAM idle target

## 📚 Documentation

- [IDE_AGENT_PLANNING.md](./IDE_AGENT_PLANNING.md) - Full project specification, timeline, tech stack rationale
- [MCP.md](./MCP.md) - Image analysis rules, MCP tool usage guides
- [AGENTS.md](./AGENTS.md) - Quick reference for development agents, critical gotchas

## 🤝 Contributing

This is currently a personal/open-source project. We welcome contributions!

When contributing:
1. Follow existing documentation patterns
2. Add tests for new features (Vitest + Playwright)
3. Update relevant MD files when changing specs
4. Keep commit messages descriptive
5. Follow TypeScript strict mode

## 📄 License

Apache License 2.0 - See [LICENSE](./LICENSE) file for details.

By using this software, you agree to the terms and conditions of the Apache License, Version 2.0.

---

**Made with ❤️ for developers who want AI-assisted coding done right**

*Status: Week 1 complete • Building Week 2 features now*
