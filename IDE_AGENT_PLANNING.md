# IDE Agent Project Planning

**Target Platform:** Linux/Windows Desktop (Android ditunda)  
**Goal:** Standalone executable IDE dengan custom AI agent integration  
**Date:** 2026-06-17

---

## Pilihan Approach (Isi yang dipilih)

- [ ] **Continue.dev Fork** - Fastest MVP (1-2 minggu)
- [*] **Electron + Monaco** - Fast, large bundle (2-3 minggu)
- [ ] **Tauri + Monaco** - Modern, small binary (3-4 minggu)
- [ ] **Custom from scratch** - Full control, longest (2-3 bulan)
- [ ] **Hybrid:** Prototype dengan _______________ lalu migrate ke _______________

**Final Decision:**  
_[Kita gunakan Electron dan monaco saja fokus build untuk Windows dan Linux]_

---

## 1. Development Experience

**Familiar dengan tech stack apa?** (centang semua yang applicable)

- [*] JavaScript/TypeScript
- [*] React
- [*] Vue
- [ ] Svelte
- [ ] Rust
- [*] Python
- [*] Node.js ecosystem
- [ ] Electron development
- [*] Web development (HTML/CSS)

**Level confidence:**
- [ ] Beginner - perlu banyak tutorial
- [*] Intermediate - bisa ikuti docs
- [ ] Advanced - bisa debug complex issues

**Learning willingness:**
- [*] Mau belajar tech baru kalau hasilnya better
- [ ] Prefer stick dengan yang sudah familiar

---

## 2. IDE Feature Scope

**Pilih complexity level:**

### Option A: Minimal Chat Agent ⚡ (1-2 minggu)
- [ ] **Pilih ini**

Features:
- Chat interface dengan AI agent
- Agent execute tools (read/write file, bash) di background
- Show code diffs hasil agent work
- Minimal/no editor integration (just preview)
- File picker untuk select working directory

**Best for:** Quick validation, proof of concept

---

### Option B: Basic IDE 🔧 (3-4 minggu)
- [*] **Pilih ini**

Features semua dari A, plus:
- File explorer tree (sidebar)
- Monaco editor dengan syntax highlighting
- Multi-tab editing
- Terminal embedded
- Agent integrate langsung dengan editor
- Save/load workspace

**Best for:** Production-ready tool, daily use

---

### Option C: Full-Featured IDE 🚀 (2-3 bulan)
- [ ] **Pilih ini**

Features semua dari B, plus:
- Git integration (status, commit, push/pull)
- Extensions/plugins system
- Multi-workspace support
- Debugging support
- Custom themes
- Settings/preferences UI
- Auto-updater

**Best for:** Competitor ke Cursor/Windsurf

---

## 3. API Specification

**API endpoint details:**

**Base URL:** `http://localhost:1430/v1`

**Authentication:**
- [x] Bearer token
- [ ] API key header
- [ ] No auth
- [x] OpenAI compatible (Bearer token in Authorization header)

**API Key:** `enx-1b02a0ea0328c3371a5315b76f05ef620ef0323014cc92e0dfb883afae981c0a`

**Capabilities:**

Streaming support?
- [x] Yes (SSE) ✅ CONFIRMED
- [ ] Yes (WebSocket)
- [ ] No (polling only)

Function calling/tool use support?
- [x] Yes, OpenAI format ✅ CONFIRMED
- [ ] Yes, custom format
- [ ] No

**Request format example:**
```json
{
  "model": "kiro/claude-sonnet-4.5-thinking-agentic",
  "messages": [
    {"role": "user", "content": "What is the current time?"}
  ],
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_current_time",
      "description": "Get the current time",
      "parameters": {
        "type": "object",
        "properties": {}
      }
    }
  }],
  "stream": true,
  "max_tokens": 4096
}
```

**Response format example (streaming):**
```json
data: {"choices":[{"delta":{"reasoning_content":"User asks for current time..."},"finish_reason":null,"index":0}],"created":1781659033,"id":"chatcmpl-31ec71d4","model":"kiro/claude-sonnet-4.5-thinking-agentic","object":"chat.completion.chunk"}

data: {"choices":[{"delta":{"tool_calls":[{"function":{"arguments":"{}","name":"get_current_time"},"id":"tooluse_06bGahjg90r2v0CcXtrSMH","type":"function"}]},"finish_reason":"tool_calls","index":0}],"created":1781659035,"id":"chatcmpl-31ec71d4","model":"kiro/claude-sonnet-4.5-thinking-agentic","object":"chat.completion.chunk","usage":{"completion_tokens":65,"prompt_tokens":0,"total_tokens":65}}

data: [DONE]
```

**Unique Feature:** Model streams `reasoning_content` (thinking process) before actual response!

**Model details:**
- Model name/ID: `kiro/claude-sonnet-4.5-thinking-agentic`
- Context window: `200k` tokens
- Max output tokens: `64k`
- Typical response time: `2-5 seconds` (tested)
- Special capability: Streams reasoning/thinking process via `reasoning_content` field

---

## 4. Tool Execution Requirements

**Agent perlu bisa execute apa?** (centang needed)

- [*] Read file
- [*] Write file
- [*] Edit file (surgical replace)
- [*] List directory
- [*] Search files (grep)
- [*] Bash commands
- [*] Git operations
- [*] Create/delete directories
- [*] Move/rename files
- [*] Install packages (npm, pip, etc)
- [*] Run build commands
- [*] Start dev servers
- [*] Custom: mungkin hampir semua basic execute yang biasanya ada di agent

**Execution security:**
- [ ] Unrestricted (agent can run anything)
- [*] Sandboxed (restrict certain commands)
- [*] Always ask confirmation before destructive ops
- [ ] Whitelist only safe operations

---

## 5. Distribution & Deployment

**Target distribution format:**

### Windows
- [*] Standalone .exe (portable)
- [*] Installer (NSIS/Wix)
- [ ] Auto-updater built-in
- [ ] Store distribution (Microsoft Store)

### Linux
- [*] AppImage
- [ ] .deb package
- [ ] .rpm package
- [ ] Snap
- [ ] Flatpak
- [*] Binary + install script

**Update mechanism:**
- [ ] Manual download from website
- [*] Auto-update check on startup
- [*] Background auto-update
- [ ] No updates (users download new version)

**Installation size preference:**
- [*] Don't care about size
- [ ] Prefer < 100MB
- [ ] Prefer < 50MB
- [ ] Must be < 20MB

---

## 6. Timeline & Priorities

**Target timeline:**

MVP ready by: `3-4 weeks` (Agent can write code automatically to IDE, user can edit like VS Code)

**Must-have features for MVP:**
1. Chat interface with streaming response (real-time typing effect)
2. File explorer tree to browse project folders
3. Monaco editor with syntax highlighting (JS/TS/Python/Java/C++/Go/Rust)
4. Agent can write/edit files directly to editor tabs
5. Terminal embedded for running commands
6. Show diff preview before applying changes
7. Multi-tab editing support
8. Basic error handling and retry logic

**Nice-to-have (post-MVP):**
- Git status indicator in file tree (modified/untracked files)
- Search across files (Ctrl+Shift+F)
- Settings panel to configure API endpoint/key
- Keyboard shortcuts (Ctrl+S save, Ctrl+P quick open, Ctrl+` terminal)
- Session persistence (reopen last workspace on startup)
- Code formatting integration (Prettier/Black/gofmt)
- Minimap in editor sidebar
- Multiple workspace folders
- Split editor view (side-by-side files)

**Dealbreakers (cannot compromise):**
- Agent MUST edit files with surgical precision (no full-file rewrites)
- Sandboxed execution with user confirmation for destructive operations
- Streaming response for better UX (show thinking process)
- Cross-platform binary (Windows .exe + Linux executable)
- Offline-capable after initial setup (no cloud dependency)

---

## 7. UI/UX Preferences

**Design inspiration:** (paste links atau describe)

**Visual References:**
- Cursor IDE - split chat/editor paradigm with inline diffs
- VS Code - clean file tree + editor + integrated terminal layout
- GitHub Copilot Chat - conversational AI integration pattern

**Color Theme:**
- Dark: VS Code Dark+ (default) or Monokai Pro
- Light: GitHub Light or Solarized Light

**Color scheme:**
- [ ] Dark mode only
- [ ] Light mode only
- [*] Both (toggle)
- [ ] System follows OS theme

**Layout preference:**
- [ ] VS Code-like (sidebar left, editor center, terminal bottom)
- [ ] Chat-first (chat prominent, editor secondary)
- [*] Split 50/50 (chat left, editor right)
- [ ] Custom: _______________________________

---

## 8. Additional Context

**Project name/branding:**  

**Suggestions:**
- NyxIDE (matches folder name)
- KiroStudio (matches model name)
- AgentCode
- FlowIDE
- ThinkIDE (emphasizes reasoning capability)

**Recommended:** `NyxIDE` or `KiroStudio`

**Target users:**
- [ ] Personal use only
- [ ] Small team (< 10)
- [*] Public release (open source)
- [ ] Commercial product

**Existing codebase to integrate?**
- [*] No, start fresh
- [ ] Yes, have prototype: _______________________________
- [ ] Yes, existing tools: _______________________________

**Special requirements/constraints:**

- Must work offline after initial download (no cloud dependency)
- API endpoint configurable via settings UI (support multiple servers)
- Portable mode available (settings stored in app folder, not system)
- Memory efficient (target <500MB RAM usage at idle)
- Fast startup time (target <3 seconds cold start)
- Safe execution model (always confirm before rm, destructive git ops)
- Reasoning display (show model's thinking process from `reasoning_content`)

---

## Next Steps (Akan diisi setelah questionnaire complete)

### Recommended Tech Stack:

**Frontend Framework:** React 18 + TypeScript
- Reason: Strong ecosystem, familiar to team, excellent tooling

**Desktop Framework:** Electron 28+
- Reason: Mature, fast development, excellent Monaco integration
- Bundle size: ~150-200MB (acceptable per requirements)

**Code Editor:** Monaco Editor
- Reason: Same engine as VS Code, battle-tested, 100+ languages

**UI Components:** 
- Ant Design or Chakra UI (pre-built components)
- react-split-pane (resizable panels)
- xterm.js (terminal emulator)

**State Management:** Zustand or React Context
- Reason: Lightweight, less boilerplate than Redux

**API Client:** Custom SSE client with axios fallback
- Handle streaming responses
- Parse `reasoning_content` and `content` separately

**Build Tools:**
- Vite (fast dev server)
- electron-builder (packaging .exe, AppImage)

**Testing:**
- Vitest (unit tests)
- Playwright (e2e tests)

### Implementation Phases:

**Phase 1: Foundation (Week 1)**
- Project setup (Electron + React + TypeScript)
- Basic window with split layout (chat left, editor right)
- Monaco editor integration with syntax highlighting
- File tree component (read-only)

**Phase 2: API Integration (Week 2)**
- SSE client for streaming responses
- Parse `reasoning_content` vs `content` streams
- Chat UI with message history
- Tool calling protocol (read/write/edit/bash)
- Display thinking process in chat

**Phase 3: Editor Features (Week 3)**
- Multi-tab editing
- File operations (open, save, create, delete)
- Terminal integration (xterm.js)
- Diff viewer for proposed changes
- User confirmation dialogs for destructive ops

**Phase 4: Polish & Package (Week 4)**
- Settings UI (API endpoint, key, theme)
- Keyboard shortcuts
- Error handling and retry logic
- Build scripts (electron-builder)
- Testing (basic e2e flows)
- Documentation (README, usage guide)

### Week-by-Week Roadmap:

**Week 1: Foundation Setup**
Day 1-2:
- Initialize Electron + React + TypeScript project
- Configure Vite build system
- Basic window creation and menu bar

Day 3-4:
- Implement split-pane layout (chat 40%, editor 60%)
- Integrate Monaco Editor with basic config
- Add syntax highlighting for common languages

Day 5-7:
- Build file tree component (react-tree-view)
- Add file system reading capabilities
- Basic navigation (click to preview file)

**Deliverable:** Electron app that displays file tree and can open files in Monaco editor

---

**Week 2: AI Integration**
Day 1-2:
- Implement SSE streaming client for API
- Create chat UI (message bubbles, input box)
- Handle authentication (Bearer token)

Day 3-4:
- Parse streaming response chunks
- Display `reasoning_content` separately (collapsible)
- Show content/tool calls in real-time

Day 5-7:
- Implement tool execution handlers:
  - read_file, write_file, edit_file
  - list_directory, search_files
  - bash command execution
- Tool result display in chat

**Deliverable:** Working chat that can execute file operations via API

---

**Week 3: Editor Integration**
Day 1-2:
- Multi-tab system for editor
- File operations (save, create new, delete)
- Unsaved changes indicator

Day 3-4:
- Terminal integration using xterm.js
- Bidirectional communication (input/output)
- Process management (start/stop commands)

Day 5-7:
- Diff viewer for agent proposed changes
- Approval/rejection workflow
- Confirmation dialogs for destructive operations
- Apply changes to editor on approval

**Deliverable:** Fully integrated IDE where agent can propose and apply file changes

---

**Week 4: Polish & Distribution**
Day 1-2:
- Settings panel UI (API config, theme toggle)
- Keyboard shortcuts implementation
- Session persistence (workspace state)

Day 3-4:
- Error handling refinement
- Loading states and progress indicators
- Retry logic for failed API calls

Day 5-6:
- electron-builder configuration
- Build Windows .exe (portable + installer)
- Build Linux AppImage
- Auto-updater setup

Day 7:
- Basic e2e testing
- Documentation (README, quick start guide)
- Release preparation

**Deliverable:** Production-ready MVP with installers for Windows and Linux

### Critical Risks & Mitigations:

**Risk 1: SSE Parsing Complexity**
- Problem: API returns `reasoning_content` + `content` + `tool_calls` in separate chunks
- Impact: Chat may display garbled/out-of-order messages
- Mitigation: Build robust SSE parser with state machine, test with long responses

**Risk 2: File Write Race Conditions**
- Problem: Agent writes file while user editing same file
- Impact: Data loss or merge conflicts
- Mitigation: Lock editing during agent operations, show diff before applying

**Risk 3: Destructive Command Execution**
- Problem: Agent calls `rm -rf` or similar without confirmation
- Impact: User data loss
- Mitigation: Sandbox execution, whitelist safe commands, always confirm destructive ops

**Risk 4: Electron Bundle Size**
- Problem: Final .exe/.AppImage exceeds 500MB
- Impact: Slow download, disk space concerns
- Mitigation: Tree-shake unused Monaco languages, use asar compression, acceptable up to 200MB

**Risk 5: API Timeout/Errors**
- Problem: Long-running requests timeout or fail mid-stream
- Impact: Partial responses, broken UI state
- Mitigation: Implement retry logic, show error messages, allow manual retry

**Risk 6: Monaco Performance**
- Problem: Large files (>10k lines) cause editor lag
- Impact: Poor UX
- Mitigation: Enable virtualization in Monaco config, lazy load file tree nodes

---

## Notes & Questions

_[Tulis catatan, concern, atau pertanyaan tambahan disini]_
