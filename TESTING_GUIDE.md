# 🧪 Phase 1 Testing Guide

**Status:** ✅ READY TO TEST  
**Build:** Complete (AppImage 108MB)  
**Last Commit:** Phase 1 - Core editor features complete

---

## 🚀 **Cara Test di Laptop Linux Anda**

### **Option 1: Development Mode (Recommended untuk testing)**

```bash
# Navigate ke project folder
cd /home/nyx/Documents/nyxide

# Pull latest changes dari GitHub
git pull origin main

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

**Expected behavior:**
1. Vite dev server starts di `http://localhost:5173`
2. Electron window opens automatically
3. DevTools may open (development mode)
4. Window size: 1400x900px

### **Option 2: Production AppImage**

```bash
# Navigate ke release folder
cd /home/nyx/Documents/nyxide/release

# Make executable (jika perlu)
chmod +x NyxIDE-0.1.0.AppImage

# Run AppImage
./NyxIDE-0.1.0.AppImage
```

---

## ✅ **Testing Checklist**

### **Test 1: Open Folder**
- [ ] Klik button "Open Folder" di header File Explorer (kanan atas)
- [ ] Dialog "Open Folder" muncul (native Electron dialog)
- [ ] Pilih folder apapun (misal: `/home/nyx/Documents` atau project folder lain)
- [ ] Klik "Open" / "Select"
- [ ] **Expected:** Tree view populate dengan files dan folders dari directory yang dipilih
- [ ] Root folder name muncul di header tree (contoh: "Documents")

### **Test 2: Navigate Directory Tree**
- [ ] Klik folder untuk expand
- [ ] **Expected:** 
  - Loading spinner (⏳) muncul sebentar
  - Children files/folders muncul
  - Arrow icon rotate 90° (▶ → ▼)
- [ ] Klik folder yang sama lagi untuk collapse
- [ ] **Expected:** Children hilang, arrow kembali ke ▶
- [ ] Expand multiple levels (folder dalam folder)
- [ ] **Expected:** Semua levels expand correctly dengan indentation yang proper

### **Test 3: Open File in Editor**
- [ ] Expand folder yang berisi files
- [ ] Klik file (contoh: `.md`, `.txt`, `.js`, `.py`)
- [ ] **Expected:**
  - Tab baru muncul di tab bar dengan nama file
  - Tab shows circle indicator (○) = not modified
  - Monaco editor loads dengan file content
  - Syntax highlighting sesuai file type
  - Status bar shows: file name, language, UTF-8, LF

### **Test 4: Edit File**
- [ ] Klik di editor area untuk focus
- [ ] Type some text atau delete existing content
- [ ] **Expected:**
  - Tab indicator berubah dari ○ ke ● (modified)
  - Status bar shows "Modified"
- [ ] Undo (Ctrl+Z) → **Expected:** Content kembali, indicator tetap ●
- [ ] Redo (Ctrl+Y atau Ctrl+Shift+Z)

### **Test 5: Save File**
- [ ] Edit file sehingga modified (● muncul)
- [ ] Press **Ctrl+S**
- [ ] **Expected:**
  - File saved ke disk
  - Tab indicator berubah dari ● ke ○ (not modified)
  - Status bar: "Modified" hilang
  - Console log (DevTools): "File saved successfully"
- [ ] Verify dengan buka file di text editor lain → Content should be updated

### **Test 6: Multi-Tab Workflow**
- [ ] Open first file (File A)
- [ ] Open second file (File B) dari File Explorer
- [ ] **Expected:**
  - Dua tabs muncul di tab bar
  - Active tab (File B) has blue bottom border
  - Inactive tab (File A) has transparent border
- [ ] Click tab File A
- [ ] **Expected:** 
  - File A becomes active (blue border)
  - Monaco shows File A content
- [ ] Click tab File B
- [ ] **Expected:** Switch back to File B

### **Test 7: Close Tab (No Unsaved Changes)**
- [ ] Open file yang tidak dimodifikasi (○ indicator)
- [ ] Hover close button (X) di tab
- [ ] **Expected:** Close button highlight
- [ ] Click X
- [ ] **Expected:**
  - Tab hilang
  - Jika ada tab lain → Switch ke tab terakhir
  - Jika tidak ada tab → Empty state muncul ("No file open")

### **Test 8: Close Tab (With Unsaved Changes)**
- [ ] Open file dan edit sehingga modified (●)
- [ ] Click X untuk close tab
- [ ] **Expected:**
  - Confirmation dialog muncul: `"filename" has unsaved changes. Do you want to save before closing?`
  - Two options: OK (save) / Cancel (don't save)
- [ ] Click **OK**
- [ ] **Expected:**
  - File saved automatically
  - Tab closes
- [ ] **Test lagi:** Edit file → Click X → Click **Cancel**
- [ ] **Expected:** Tab tetap open, changes tidak saved

### **Test 9: Language Auto-Detection**
Open files dengan different extensions dan verify syntax highlighting:

- [ ] `.js` file → JavaScript highlighting
- [ ] `.ts` file → TypeScript highlighting
- [ ] `.py` file → Python highlighting
- [ ] `.md` file → Markdown highlighting
- [ ] `.json` file → JSON highlighting (dengan folding)
- [ ] `.html` file → HTML highlighting
- [ ] `.css` file → CSS highlighting

**Expected:** Monaco auto-detect language dan apply appropriate syntax highlighting

### **Test 10: Keyboard Shortcuts**
- [ ] **Ctrl+S** (Save)
  - Edit file → Press Ctrl+S → File saved
- [ ] **Escape** (Toggle chat panel)
  - Press Escape → Chat panel collapse/expand
- [ ] **Ctrl+F** (Find in file - Monaco built-in)
  - Press Ctrl+F → Find widget muncul di top-right editor
- [ ] **Ctrl+H** (Replace - Monaco built-in)
  - Press Ctrl+H → Replace widget muncul
- [ ] **Ctrl+G** (Go to line - Monaco built-in)
  - Press Ctrl+G → Input line number → Jump to line
- [ ] **Ctrl+/** (Toggle comment - Monaco built-in)
  - Select code → Press Ctrl+/ → Code commented/uncommented

### **Test 11: Status Bar**
- [ ] Check status bar di bottom (blue bar)
- [ ] **Expected displays:**
  - Left: `{N} files open` (count dari tabs)
  - Middle: Current file info (name, language, Modified, UTF-8, LF)
  - Right: `NyxIDE` branding
- [ ] Open/close files → Count updates
- [ ] Switch tabs → File info updates
- [ ] Edit file → "Modified" appears
- [ ] Save file → "Modified" disappears

### **Test 12: Visual Feedback**
- [ ] **File Explorer hover:**
  - Hover file/folder → Background changes to #2a2d2e
  - Selected item → Blue background (#094771) + left border
- [ ] **Tab hover:**
  - Hover inactive tab → Background changes to #2a2d2e
  - Active tab → Stays #1e1e1e
- [ ] **Close button hover:**
  - Hover X button → Background #3c3c3c, color white

---

## 🎯 **Success Criteria**

Phase 1 dianggap **SUKSES** jika semua test di atas pass:

✅ Open Folder dialog works  
✅ Recursive tree loading works  
✅ Click file opens in editor  
✅ Edit file shows modified indicator  
✅ Ctrl+S saves file  
✅ Close tab handles unsaved changes  
✅ Multi-tab switching works  
✅ Language auto-detection works  
✅ Keyboard shortcuts work  
✅ Status bar shows correct info  
✅ Visual feedback smooth  

---

## 🐛 **Known Issues & Limitations**

### **Not Implemented Yet (Phase 2):**
- ❌ Create new file
- ❌ Delete file
- ❌ Rename file
- ❌ Create new folder
- ❌ Context menu (right-click)
- ❌ Search across files
- ❌ Terminal integration
- ❌ Settings panel

### **Known Limitations:**
- ⚠️ File tree tidak auto-refresh jika file diubah external
- ⚠️ Tidak ada file watching (manual refresh dengan close/open folder)
- ⚠️ Chat panel masih placeholder (AI integration Phase 3)
- ⚠️ Large directories (>1000 files) mungkin lambat (belum virtualized)

---

## 📝 **Troubleshooting**

### **Issue: Window tidak muncul**
```bash
# Test dengan virtual display
xvfb-run -a npm run dev
```

### **Issue: "Failed to open file" error**
- Check file exists di filesystem
- Check file permissions (readable)
- Check console (DevTools) untuk detailed error

### **Issue: Ctrl+S tidak save**
- Check file writable (tidak read-only)
- Check disk space
- Check console untuk error messages

### **Issue: Syntax highlighting tidak muncul**
- Check file extension valid
- Monaco supports most common languages
- Check language detected di status bar

### **Issue: Tab close tidak prompt save**
- Make sure file modified (● indicator visible)
- Check browser dialogs tidak blocked
- Try click X lagi

---

## 🎮 **Demo Workflow (Recommended Test Path)**

Follow this sequence untuk comprehensive test:

1. **Start app** (`npm run dev`)
2. **Open Folder** → Pilih `/home/nyx/Documents/nyxide`
3. **Navigate** → Expand `src` folder → Expand `components`
4. **Open file** → Click `FileExplorer.tsx`
5. **Verify** → Syntax highlighting (TypeScript), line numbers, minimap
6. **Edit** → Add comment `// Test edit` di line 1
7. **Check** → Tab shows ●, status bar shows "Modified"
8. **Save** → Press Ctrl+S
9. **Verify** → Tab shows ○, "Modified" hilang
10. **Open another file** → Click `App.tsx` dari tree
11. **Switch tabs** → Click `FileExplorer.tsx` tab → Click `App.tsx` tab
12. **Edit second file** → Add comment di `App.tsx`
13. **Close first tab** (FileExplorer.tsx - not modified) → Should close without prompt
14. **Close second tab** (App.tsx - modified) → Should prompt to save
15. **Click OK** → File saved, tab closes
16. **Check status bar** → Count decreases, file info updates

---

## ✅ **Test Report Template**

Jika ada issue, report dengan format ini:

```
**Issue:** [Describe what went wrong]
**Steps to reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Environment:**
- OS: Linux (distro?)
- Node version: (node --version)
- App version: Phase 1

**Console error (if any):**
[Paste error from DevTools console]

**Screenshot (if applicable):**
[Attach screenshot]
```

---

## 🎉 **Ready to Test!**

Semua fitur Phase 1 sudah implemented dan tested di build. Sekarang saatnya test di laptop Anda!

**Questions/Issues?** Let me know dan saya akan fix! 🚀

---

**Last Updated:** 2026-06-17  
**Build Status:** ✅ SUCCESS  
**Git Commit:** 6291bc5 (Phase 1: Core editor features complete)
