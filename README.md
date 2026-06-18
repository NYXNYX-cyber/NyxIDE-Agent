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
- ⌨️ **Terminal integrated** - Full PTY terminal for proper command execution
- 🚀 **Cross-platform** - Windows (.exe) and Linux (AppImage) support

## 📋 Roadmap Status

| Feature | Status | Target |
|---------|--------|--------|
| Project Planning | ✅ Complete | Done |
| Foundation (Window, Monaco, File Tree) | ✅ Complete | Week 1 DONE |
| Core Editor Features | ✅ Complete | Phase 1 DONE |
| Menu Bar (File, Edit, View, Help) | ✅ Complete | Phase 1 DONE |
| Collapsible Panels (Chat/Explorer) | ✅ Complete | Phase 1 DONE |
| AI API Integration | ⏳ Pending | Week 2 |
| Chat Interface & Streaming | ⏳ Pending | Week 2 |
| Multi-tab Editing | ✅ Complete | Phase 1 DONE |
| Terminal Integration (PTY) | ✅ Complete | Week 3 DONE |
| Diff Viewer & Approval Workflow | ⏳ Pending | Week 3 |
| Settings & Polish | ⏳ Pending | Week 4 |
| Cross-platform Build | ✅ Complete | Phase 1 DONE |
| File Operations | ⏳ In Progress | Phase 2 NOW |

**MVP Goal:** 3-4 weeks from initialization

## 🛠️ Tech Stack

- **Desktop Framework:** Electron 28+ (42.4.1)
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 8.0.12
- **Code Editor:** Monaco Editor (via @monaco-editor/react)
- **Terminal:** xterm.js + node-pty (pseudo-terminal emulation)
- **UI Components:** Ant Design
- **State Management:** Zustand (planned)
- **Packaging:** electron-builder 26.15.3

## 🏗️ Phase 1 Implementation - COMPLETE! ✅

**Core editor features fully functional!**

### ✅ What Works:

**Menu Bar (NEW!):**
- ✅ Professional VS Code-style menu (File, Edit, View, Help)
- ✅ Click-based access in addition to keyboard shortcuts
- ✅ Full keyboard shortcut reference
- ✅ Dark theme matching IDE
- ✅ Dropdown with smooth animations
- ✅ Auto-detect platform (Ctrl/⌘)

**File Explorer:**
- ✅ Open Folder dialog (Electron native dialog)
- ✅ Recursive tree loading (expand/collapse folders)
- ✅ Click file → Opens in Monaco editor
- ✅ File type icons (📁 folders, 📜 JS/TS, 🐍 Python, etc)
- ✅ Visual feedback (selected state, hover effects)
- ✅ Collapsible with toggle button (Ctrl+B)

**Monaco Editor:**
- ✅ Full editor integration (VS Code Dark+ theme)
- ✅ Syntax highlighting for 15+ languages
- ✅ Auto-detect language from file extension
- ✅ Line numbers, minimap, code folding
- ✅ IntelliSense & autocomplete
- ✅ Ctrl+S save functionality

**Tab Management:**
- ✅ Real state management (no mock data)
- ✅ Tab click → Load file content
- ✅ Tab close → Handle unsaved changes
- ✅ Modified indicator (●) for unsaved files
- ✅ Active tab highlighting
- ✅ Sync between File Explorer and Tabs

**Chat Panel:**
- ✅ Collapsible design (20% width, fully hides to 0px)
- ✅ Toggle button (Escape key)
- ✅ Placeholder for AI integration (Week 2)

**Keyboard Shortcuts:**
- ✅ Ctrl+S → Save file
- ✅ Ctrl+N → New file
- ✅ Ctrl+O → Open file
- ✅ Ctrl+W → Close tab
- ✅ Escape → Toggle chat panel
- ✅ Ctrl+B → Toggle File Explorer
- ✅ All Monaco shortcuts (Ctrl+F find, Ctrl+H replace, etc)

**Status Bar:**
- ✅ Shows open files count
- ✅ Current file name & path
- ✅ Language indicator
- ✅ Modified status
- ✅ Encoding (UTF-8) & line ending (LF)
- ✅ Version display (NyxIDE v0.1.0)

### 🎯 Workflow Test (All Passed):

1. ✅ **Menu Bar Test:**
   - Click "File" menu → See dropdown with options
   - Click "File" → "New File" → Enter filename → File created
   - Click "File" → "Open Folder" → Select directory
   - Click "View" → "Toggle Explorer" → Explorer hides/shows
   - Press Ctrl+B → Same as menu toggle
   - Click "Help" → "About NyxIDE" → See version info

2. ✅ **File Explorer Test:**
   - Click "Open Folder" button in Explorer
   - Select directory → Tree populates
   - Expand folder → Children load with spinner
   - Click file → Opens in new tab with content

3. ✅ **Editor Workflow:**
   - Edit file → Modified indicator (●) appears
   - Ctrl+S → File saved → Indicator disappears
   - Open another file → Second tab appears
   - Switch tabs → Monaco updates content

4. ✅ **Panel Management:**
   - Click "×" on Chat panel → Fully hides (0px)
   - Click "⌨️" button → Chat panel returns
   - Click "×" on Explorer → Hides
   - Click "📁" button → Explorer returns
   - Press Escape → Toggle Chat
   - Press Ctrl+B → Toggle Explorer

5. ✅ **Tab Management:**
   - Close tab (unmodified) → Closes immediately
   - Close tab (modified) → Prompts "Save changes?"
   - Click "OK" → Saves and closes
   - Click "Cancel" → Keeps tab open

### 📦 Build Success:
- ✅ TypeScript compilation passing
- ✅ Vite build (155ms)
- ✅ electron-builder (AppImage 108MB)
- ✅ Git push successful

---

## ⌨️ Terminal Implementation - COMPLETE! ✅

**Full pseudo-terminal (PTY) integration with proper command output!**

### ✅ What Works:

**Terminal Panel:**
- ✅ Integrated terminal at bottom (250px height)
- ✅ Smooth animations (collapsible like Chat/Explorer)
- ✅ Toggle with Ctrl+` (backtick) or View → Toggle Terminal
- ✅ "⌨️ Terminal" button when closed
- ✅ × close button when open
- ✅ Dark theme matching VS Code (#1e1e1e)

**PTY (Pseudo-Terminal) Features:**
- ✅ **node-pty integration** - Real terminal emulation (not just exec)
- ✅ **Perfect output formatting** - `ls`, `pwd`, `date` work exactly like native terminal
- ✅ **Color output** - LS_COLORS, git colored output, etc
- ✅ **Interactive commands** - `vim`, `nano`, `htop`, `top` fully supported
- ✅ **Signal handling** - Ctrl+C, Ctrl+Z work properly
- ✅ **Auto-complete** - Tab completion works
- ✅ **Command history** - Arrow keys navigate history
- ✅ **Scrollback buffer** - 10,000 lines of history
- ✅ **Working directory sync** - Opens in Explorer's folder (or home if none)

**Keyboard Shortcuts:**
- ✅ Ctrl+` → Toggle terminal panel
- ✅ Ctrl+C → Interrupt running command
- ✅ Ctrl+Z → Suspend command
- ✅ Ctrl+L → Clear screen
- ✅ All standard shell shortcuts

**Architecture:**
- **Main Process:** PTY instances managed via IPC (pty-create, pty-write, pty-resize, pty-kill)
- **Renderer Process:** xterm.js connects to PTY via Electron context bridge
- **Shell:** Spawns bash (Linux) or powershell.exe (Windows) with proper TERM environment

### 🎯 Workflow Test (All Passed):

1. ✅ **Terminal Toggle Test:**
   - Press Ctrl+` → Terminal opens at bottom
   - Press Ctrl+` again → Terminal closes
   - Click View → Toggle Terminal → Same behavior
   - Click "⌨️ Terminal" button → Terminal opens
   - Click × button → Terminal closes

2. ✅ **Command Execution Test:**
   ```bash
   ls              # Horizontal grid output (perfect!)
   ls -la          # Detailed listing with colors
   pwd             # Current directory (synced with Explorer)
   cd <folder>     # Change directory works
   npm run dev     # Run Node.js processes
   git status      # Git commands with colored output
   ```

3. ✅ **Interactive Commands Test:**
   ```bash
   vim file.txt    # Full-screen editor works!
   htop            # Process monitor works!
   top             # Task manager works!
   nano            # Another editor works!
   ```

4. ✅ **Signal Handling Test:**
   - Run `sleep 100` → Press Ctrl+C → Command killed
   - Run `cat` → Press Ctrl+C → Exits cleanly
   - All signals properly forwarded to PTY

### 🔧 Technical Details:

**Why PTY?**
- `child_process.exec()` doesn't provide proper TTY, so commands like `ls` output vertically
- PTY (Pseudo-Terminal) emulates a real terminal, so all commands detect proper width/height
- Result: **100% perfect output formatting** like native terminal

**Implementation:**
```javascript
// Main Process (main.js)
const ptyProcess = pty.spawn('bash', [], {
  name: 'xterm-256color',
  cols: 120,
  rows: 24,
  cwd: cwd,
  env: { ...process.env, TERM: 'xterm-256color' }
})

// Forward data to renderer
ptyProcess.onData((data) => {
  mainWindow.webContents.send('pty-data', { id, data })
})

// Renderer Process (Terminal.tsx)
xterm.onData((input) => {
  window.nyxide.ptyWrite(ptyId, input)
})

window.nyxide.onPtyData(({ id, data }) => {
  if (id === ptyId) xterm.write(data)
})
```

**Features:**
- Auto-resize PTY when terminal panel resizes
- Working directory syncs with File Explorer (or defaults to home)
- Clean PTY cleanup on component unmount
- Cross-platform support (bash on Linux, powershell on Windows)

---

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

### Try It Out:

1. **Run app:** `npm run dev` or `./release/NyxIDE-0.1.0.AppImage`
2. **Click "Open Folder"** button in File Explorer
3. **Navigate** to any directory (your project folder)
4. **Click a file** → Opens in Monaco editor
5. **Edit content** → Notice ● appears in tab
6. **Press Ctrl+S** → File saved, ● disappears
7. **Close tab** → If modified, prompts to save
8. **Press Ctrl+`** → Terminal opens at bottom!
9. **Type `ls`** → Perfect output with colors!
10. **Type `npm run dev`** → Run your Node.js app!

**That's it! Full editor + terminal workflow working!** 🎉

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
│   ├── main.js         # Electron main process + IPC handlers + PTY management
│   └── preload.js      # Context bridge (security) + PTY APIs
├── src/
│   ├── components/
│   │   ├── FileExplorer.tsx    # Directory tree component
│   │   ├── ChatPanel.tsx        # Chat interface
│   │   ├── EditorTabs.tsx       # Multi-tab system
│   │   ├── CodeEditor.tsx       # Monaco editor wrapper
│   │   ├── MenuBar.tsx          # VS Code-style menu bar
│   │   └── Terminal.tsx         # xterm.js + node-pty integration
│   ├── context/
│   │   └── AppContext.tsx       # Global state management
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

## 🤝 Contributing

This is currently a personal/open-source project. We welcome contributions!

When contributing:
1. Follow existing documentation patterns
2. Add tests for new features (Vitest + Playwright)
3. Keep commit messages descriptive
4. Follow TypeScript strict mode

## 📄 License

Apache License 2.0 - See [LICENSE](./LICENSE) file for details.

By using this software, you agree to the terms and conditions of the Apache License, Version 2.0.

---

**Made with ❤️ for developers who want AI-assisted coding done right**

*Status: Phase 1 Complete • Menu Bar Added • Terminal with PTY Implemented • Ready for Week 2 AI Integration*
