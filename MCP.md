# Agent Rules for OpenCode

## 🖼️ Image Analysis Rules (CRITICAL)

### ⚠️ **STRICT REQUIREMENT: ALWAYS USE `imageAnalyzer` MCP FOR IMAGES**

**DO NOT** use the regular `Read` tool or any built-in file reading for images! 
- ❌ `Read` tool CANNOT see image content (only reads metadata/binary)
- ✅ `analyze_image` from MCP can analyze images with vision AI
- 🎯 Model has NO image modality enabled - must use MCP

### Why This Is Critical:
- Your model (`Qwen 3.7 Max`) has been configured WITHOUT image input capability
- If you try to read images directly, you'll get binary data or metadata only
- The result will be useless and confusing to the user
- Only MCP Image Analyzer provides actual image understanding

---

## 📋 Step-by-Step Guide for Image Analysis

### 1. **When User Sends an Image** (e.g., `@image.png`, `@screenshot.jpg`):

**Correct Approach:**
```python
✅ Use: analyze_image(image_path: "/path/to/image")
```

**Wrong Approach:**
```python
❌ Don't: Read("/path/to/image")  # Will return binary/metadata
```

### 2. **Example Scenarios:**

**Scenario A: General Description**
```
User: "coba lihat @tesimage.png ini apa"

Your response:
Thinking: User sent a PNG image, need to use MCP image analyzer
Call: analyze_image(image_path="/home/nyx/.config/opencode/tesimage.png")
Receive: Detailed description from vision model
Answer: Explain what's in the image based on analysis
```

**Scenario B: Extract Text**
```
User: "@document.pdf ekstrak semua teks dari gambar"

Your response:
Call: analyze_image(
  image_path="/home/nyx/.config/opencode/document.pdf",
  instruction="Extract all visible text from this image line by line"
)
```

**Scenario C: UI/Interface Analysis**
```
User: "@ui.png apa aja fitur yang ada di screenshot ini?"

Your response:
Call: analyze_image(
  image_path="/home/nyx/.config/opencode/ui.png",
  instruction="Describe the UI layout, identify all buttons, menus, features, and components visible in this interface"
)
```

**Scenario D: Code Analysis**
```
User: "@code.png kode ini apa fungsinya?"

Your response:
Call: analyze_image(
  image_path="/home/nyx/.config/opencode/code.png",
  instruction="Extract and explain the code shown in this image. Identify programming language, functions, and purpose"
)
```

### 3. **Supported Image Formats:**

| Format | Extension | Status |
|--------|-----------|--------|
| JPEG/JPG | .jpg, .jpeg | ✅ Supported |
| PNG | .png | ✅ Supported |
| GIF | .gif | ✅ Supported |
| BMP | .bmp | ✅ Supported |
| WebP | .webp | ✅ Supported |
| SVG | .svg | ✅ Supported |
| TIFF | .tiff, .tif | ✅ Supported |
| HEIC | .heic | ✅ Supported |
| ICO | .ico | ✅ Supported |

### 4. **Common Image Paths:**

- **Screenshots**: `/home/nyx/.config/opencode/`
- **Home directory**: `/home/nyx/`
- **Desktop**: `/home/nyx/Desktop/`
- **Downloads**: `/home/nyx/Downloads/`
- **Current workspace**: Use relative paths like `./image.png`

---

## 🛠️ MCP Image Analyzer Tool Details

### Tool: `analyze_image`

**Purpose:** Analyze images using Mimo-v2.5-free vision model

**Parameters:**
- `image_path` (required): Path to image file
- `instruction` (optional): Custom analysis instructions

**Example Calls:**

```python
# Basic usage
analyze_image("/home/nyx/.config/opencode/test.png")

# With custom instruction
analyze_image(
  image_path="/home/nyx/.config/opencode/screenshot.png",
  instruction="What error message is displayed in this screenshot?"
)
```

**Output Format:**
```
✅ **Image Analysis Complete**

**File:** screenshot.png
**Format:** .PNG

---

[Detailed analysis here...]
```

### Tool: `list_supported_formats`

**Purpose:** Display supported image formats

**Usage:**
```python
list_supported_formats()
```

---

## 🚀 Common Image Analysis Workflows

### Workflow 1: Screenshot Debugging
```
User: "ini kenapa @error_screenshot.png muncul error?"

Steps:
1. Call analyze_image with specific instruction about errors
2. Look for error messages, stack traces, warning icons
3. Summarize the problem based on visual clues
4. Provide context about what might cause it
```

### Workflow 2: Document Text Extraction
```
User: "@scanned_doc.png tolong baca isi dokumen ini"

Steps:
1. Call analyze_image with OCR-focused instruction
2. Parse extracted text for key information
3. Reformat if needed for readability
```

### Workflow 3: Code Review
```
User: "@coding.png review kode ini dong"

Steps:
1. Call analyze_image asking for code extraction + explanation
2. Identify bugs, issues, or improvements
3. Suggest corrections or optimizations
```

### Workflow 4: Design/UI Feedback
```
User: "@ui_design.png bagaimana menurutmu desainnya?"

Steps:
1. Call analyze_image asking for UI component breakdown
2. Note layout, colors, typography, spacing
3. Provide feedback on consistency and best practices
```

---

## 🐛 Troubleshooting MCP Image Analyzer

### Error: "Extra data" parsing issue
**Status:** ✅ FIXED - Auto-handled now
**Cause:** Vision API returns JSON with extra characters
**Solution:** MCP server automatically parses and cleans output

### Error: "File not found"
**Possible causes:**
1. Wrong path
2. File doesn't exist
3. Typo in filename

**Solutions:**
```bash
# Check file exists
ls -la /home/nyx/.config/opencode/filename.png

# List files in directory
ls /home/nyx/.config/opencode/*.png
```

### Error: "Unsupported image format"
**Check:** File extension is in supported list above
**Try:** Convert to JPG or PNG

### Error: "API Error" or "Network Error"
**Possible causes:**
1. Vision API server down
2. Network connectivity issues
3. API key expired

**Solutions:**
```bash
# Test API manually
curl -X POST http://192.168.1.10:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-7c385384dc41adf3-8s0uu8-02500fae" \
  -d '{"model":"oc/mimo-v2.5-free"}'

# Restart opencode
opencode restart
```

### Error: Empty response from MCP
**Possible causes:**
1. Vision API timeout
2. Image too large
3. Invalid parameters

**Solutions:**
- Try again (temporary network issue)
- Compress image if > 10MB
- Remove special characters from filename

---

## 🔧 General MCP Usage Guidelines

When you need external tools, prefer MCP servers over built-in tools:

| Task | Preferred Tool | Built-in Fallback |
|------|----------------|-------------------|
| File operations | `filesystem` MCP | Built-in fs/read/write |
| HTTP requests | `fetch` MCP | None (custom solution needed) |
| Knowledge storage | `memory` MCP | Temporary variables only |
| Complex reasoning | `sequentialThinking` MCP | Standard LLM reasoning |
| **Image analysis** | **`imageAnalyzer` MCP** | **NOT AVAILABLE** ⚠️ |
| Terminal commands | External scripts | No built-in terminal |
| Git operations | Custom git MCP | None |

### Priority Order for MCP Tools:
1. **Critical:** `imageAnalyzer` - MUST USE for images
2. **Recommended:** `fetch`, `filesystem`, `memory` - Better than alternatives
3. **Optional:** `sequentialThinking` - Helps with complex tasks

---

## 📝 Response Quality Guidelines

### Before Using MCP:
1. ✅ Verify MCP is enabled and connected
   ```bash
   opencode mcp list
   ```
2. ✅ Check image file exists at specified path
3. ✅ Confirm file format is supported

### During MCP Usage:
1. ✅ Always provide clear file path
2. ✅ Use specific instructions when possible
3. ✅ Handle errors gracefully and inform user

### After MCP Analysis:
1. ✅ Interpret results in user's language
2. ✅ Add context if helpful
3. ✅ Provide actionable next steps if relevant
4. ✅ Stay concise while being thorough

### Example of Good Response:
```
Based on the image analysis:

The screenshot shows a GitHub OAuth authentication error page. 
Key findings:

1. **Error Type:** Redirect URI mismatch
2. **Message:** "The redirect_uri is not associated with this application"
3. **Context:** This happens when an app tries to authenticate but 
   its callback URL isn't registered in GitHub settings

This means either:
- The application hasn't been properly configured with GitHub
- There's a typo in the callback URL configuration
- You're trying to authenticate from a different domain than expected

To fix this, check your app's OAuth configuration settings in GitHub.
```

---

## 🎯 Quick Reference Cheat Sheet

### For Users:
```
@image.png          → Ask model to describe image
@image.png teks     → Extract text from image
@image.png ui       → Describe UI components
@image.png error    → Focus on error messages/errors
```

### For Developers:
```python
# Standard image analysis
analyze_image(path="/path/to/image.png")

# Custom instruction analysis
analyze_image(
  path="/path/to/image.png",
  instruction="Your custom question here"
)

# Check support
list_supported_formats()
```

### Debug Commands:
```bash
# List active MCP servers
opencode mcp list

# Test MCP image analyzer
cd ~/.config/opencode/mcp-image-analyzer
.venv/bin/python main.py

# Check if image exists
file /home/nyx/.config/opencode/image.png
```

---

## ⚡ Important Notes

1. **Model Configuration:** Qwen 3.7 Max has NO direct image modality - MCP IS REQUIRED
2. **Vision Model:** Uses Mimo-v2.5-free via local API endpoint
3. **Performance:** Expect ~5-10 second analysis time per image
4. **Token Usage:** Full analysis uses ~2000 tokens from vision model
5. **Response Language:** Analysis returned in English, translate as needed
6. **File Permissions:** Ensure image file is readable by Python process
7. **File Size Limit:** Optimal under 10MB for best performance

---

## 📚 Additional Resources

- MCP Image Analyzer Docs: See `~/mcp-image-analyzer/README.md`
- Vision Model API: http://192.168.1.10:20128/v1/docs
- FastMCP Framework: https://gofastmcp.com
- Discord Support: Join #opencode-mcp channel

---

**REMEMBER: When in doubt about images, ALWAYS use `analyze_image` MCP!**
