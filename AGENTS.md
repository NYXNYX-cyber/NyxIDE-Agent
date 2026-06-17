# NyxIDE Agent Instructions

**Project:** Standalone IDE with custom AI agent integration (Electron + Monaco)  
**Goal:** Create working IDE MVP in 3-4 weeks with chat-first design

---

## 🖼️ Image Analysis (CRITICAL)

**ALWAYS use `imageAnalyzer` MCP for images** — never Read tool:
- Your model (`Qwen 3.7 Max`) has NO direct image modality enabled
- Using `Read` on images returns binary/metadata only → useless results

```python
✅ Correct: analyze_image(image_path="/path/to/image.png")
❌ Wrong:   Read("/path/to/image.png")
```

**Supported formats:** .jpg, .png, .gif, .bmp, .webp, .svg, .tiff, .heic, .ico  
**Screenshot location:** `/home/nyx/.config/opencode/`

---

## 🔑 API Configuration

**Endpoint:** `http://localhost:1430/v1`  
**Model:** `kiro/claude-sonnet-4.5-thinking-agentic`  
**Auth:** Bearer token in Authorization header  

**Streaming:** Yes (SSE with reasoning_content stream)  
**Special capability:** Model streams `reasoning_content` field before actual response — display thinking process separately

**Request format:**
```json
{
  "model": "kiro/claude-sonnet-4.5-thinking-agentic",
  "messages": [{"role": "user", "content": "..."}],
  "tools": [{"type": "function", "function": {...}}],
  "stream": true,
  "max_tokens": 4096
}
```

**Response chunks may contain:**
- `reasoning_content`: Model's thinking process (display collapsible)
- `tool_calls`: Function calls to execute
- `content`: Final response text

---

## 🛠️ Tool Execution Rules

Agent can execute these operations:

| Operation | Scope | Confirmation Required? |
|-----------|-------|------------------------|
| Read/write/edit files | Workspace | Write: yes, Edit: no |
| List/search directories | Workspace | No |
| Bash commands | Restricted | Destructive ops: yes |
| Git operations | Read-only | Delete/push: yes |
| Package install | npm/yarn/pip | Always: yes |

**Security model:**
- Sandboxed execution (no unrestricted access)
- Confirm destructive ops: `rm`, `rm -rf`, git destructive commands
- Never rewrite entire files—use surgical edits with diffs
- Lock editor during agent operations to prevent race conditions

---

## 🏗️ Architecture (Planned Stack)

**Frontend:** React 18 + TypeScript + Vite  
**Desktop:** Electron 28+ (bundle ~150-200MB acceptable)  
**Editor:** Monaco Editor (same as VS Code)  
**Terminal:** xterm.js  
**UI:** Ant Design or Chakra UI  
**State:** Zustand or React Context  
**Build:** electron-builder (Windows .exe, Linux AppImage)

**Layout preference:** Split 50/50 (chat left, editor right)  
**Theme:** Dark mode (VS Code Dark+) preferred

---

## 🎯 MVP Must-Haves (Order Matters)

1. **Week 1:** Foundation
   - Electron window with split-pane layout
   - Monaco editor with syntax highlighting
   - File tree component (read-only first)

2. **Week 2:** AI Integration
   - SSE streaming client for API
   - Parse `reasoning_content` vs `content` streams
   - Tool calling protocol (read/write/bash)

3. **Week 3:** Editor Features
   - Multi-tab editing
   - Terminal integration
   - Diff viewer for proposed changes
   - User approval workflow

4. **Week 4:** Polish & Package
   - Settings UI (API config, theme)
   - Keyboard shortcuts
   - Build scripts (electron-builder)
   - Basic e2e tests

---

## ⚠️ Gotchas & Constraints

1. **SSE parsing is complex:** API sends `reasoning_content`, `content`, and `tool_calls` in separate chunks—build robust state machine parser

2. **File write race conditions:** Agent writes while user edits = data loss risk. Implement file locking + show diff before applying

3. **Bundle size control:** Tree-shake unused Monaco languages, use asar compression

4. **Large file performance (>10k lines):** Enable virtualization in Monaco config

5. **API reliability:** Implement retry logic for timeouts/failures; allow manual retry

6. **Cross-platform:** Build Windows .exe + Linux AppImage simultaneously

---

## 📝 Existing Documentation

- `IDE_AGENT_PLANNING.md`: Full project spec, timeline, feature decisions
- `MCP.md`: Detailed MCP usage guide (images, tools, troubleshooting)
- `Screenshot/`: Empty directory for storing screenshots

---

## ❓ What This Repo Does NOT Contain

This is **planning documentation only**. Actual source code does not exist yet.  
When starting implementation:

1. Initialize fresh Electron + React + TypeScript project
2. Configure Vite build system
3. Use standard scaffolding (create-react-app/electron-forge alternatives OK)
4. All file paths above assume `/home/nyx/Documents/nyxide` as workspace root

---

## 🔐 Secrets Handling

API credentials stored in: `IDE_AGENT_PLANNING.md` line 108  
**Best practice:** Move to environment variable or settings file once app implemented:
```env
NYXIDE_API_ENDPOINT=http://localhost:1430/v1
NYXIDE_API_KEY=<token>
```

---

## Quick Reference Commands

When testing local API:
```bash
curl -X POST http://localhost:1430/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -d '{"model":"kiro/claude-sonnet-4.5-thinking-agentic","messages":[{"role":"user","content":"test"}]}'
```

When checking image analyzer:
```bash
opencode mcp list
ls /home/nyx/.config/opencode/*.png
```
