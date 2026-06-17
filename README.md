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
| Foundation (Window, Monaco, File Tree) | ⏳ Pending | Week 1 |
| AI API Integration | ⏳ Pending | Week 2 |
| Chat Interface & Streaming | ⏳ Pending | Week 2 |
| Multi-tab Editing | ⏳ Pending | Week 3 |
| Terminal Integration | ⏳ Pending | Week 3 |
| Diff Viewer & Approval Workflow | ⏳ Pending | Week 3 |
| Settings & Polish | ⏳ Pending | Week 4 |
| Cross-platform Build | ⏳ Pending | Week 4 |

**MVP Goal:** 3-4 weeks from initialization

## 🛠️ Tech Stack

- **Desktop Framework:** Electron 28+
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Code Editor:** Monaco Editor
- **Terminal:** xterm.js
- **UI Components:** Ant Design / Chakra UI
- **State Management:** Zustand
- **Packaging:** electron-builder

## 📚 Documentation

See [IDE_AGENT_PLANNING.md](./IDE_AGENT_PLANNING.md) for:
- Detailed feature specifications
- API configuration and authentication
- Implementation timeline and phases
- Risk assessment and mitigations
- Tech stack rationale

See [MCP.md](./MCP.md) for:
- Image analysis rules and workflows
- MCP tool usage guidelines
- Troubleshooting guides

See [AGENTS.md](./AGENTS.md) for:
- Quick reference for development agents
- Critical gotchas and constraints
- Project-specific conventions

## 🏗️ Getting Started

### Prerequisites

Before you can build NyxIDE:

```bash
Node.js 18+ (LTS recommended)
npm or yarn or pnpm
Git
```

### Initial Setup (Once Built)

```bash
# Clone repository
git clone https://github.com/NYXNYX-cyber/NyxIDE-Agent.git
cd NyxIDE-Agent

# Install dependencies
npm install

# Start development mode
npm run dev

# Build production binaries
npm run build
```

## 🔑 Configuration

NyxIDE uses an external AI API service. Configure via Settings UI:

**Default Endpoint:** `http://localhost:1430/v1`  
**Model:** `kiro/claude-sonnet-4.5-thinking-agentic`  
**Auth:** Bearer token in Authorization header

See planning docs for detailed API spec.

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

## 🚧 Current Development Phase

This repository contains **planning documentation only**. The actual application code will be created during Week 1 implementation.

Files present:
- ✅ Project planning specification
- ✅ MCP usage guidelines
- ✅ Agent instruction document
- ❌ Application source code (coming soon)

## 🤝 Contributing

This is currently a personal/open-source project. We welcome contributions!

When contributing:
1. Follow existing documentation patterns
2. Add tests for new features
3. Update relevant MD files when changing specs
4. Keep commit messages descriptive

## 📄 License

Apache License 2.0 - See [LICENSE](./LICENSE) file for details.

By using this software, you agree to the terms and conditions of the Apache License, Version 2.0.

---

**Made with ❤️ for developers who want AI-assisted coding done right**

*Status: Planning phase complete. Building starts Week 1.*
