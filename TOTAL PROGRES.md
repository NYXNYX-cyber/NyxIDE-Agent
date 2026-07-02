# TOTAL PROGRES - NyxIDE

Dokumen ini mencatat analisis arsitektur, kode, dan progres implementasi dari seluruh komponen utama **NyxIDE** (sebuah IDE desktop berbasis Electron, React, dan Monaco Editor yang dilengkapi dengan AI Coding Assistant mandiri).

---

## 1. Deskripsi Umum & Tema Desain
NyxIDE dirancang sebagai editor kode desktop terintegrasi yang berfokus pada kecepatan dan kemudahan integrasi dengan AI Agent. 
* **Tema Visual:** Menggunakan gaya **Neo-Brutalisme** yang khas dengan garis batas hitam tebal (`border: "3px solid #000"`), bayangan solid (`boxShadow: "4px 4px 0 #000"`), font sans-serif kapital tebal, serta aksen warna kontras seperti hijau neon (`#a9ff68`).
* **Komponen Layout:** Terdiri dari Menu Bar atas, File Explorer di panel kiri, Code Editor Monaco di tengah, Terminal Emulator di bawah, dan Panel AI Chat di sebelah kanan.

---

## 2. Arsitektur & Progres Sisi Electron (Main Process)

Electron memisahkan eksekusi dengan hak istimewa tinggi (*Main Process*) dari tampilan antarmuka pengguna (*Renderer Process*) demi keamanan.

### A. Komponen Utama
1. **Main Process (`src-electron/main.cjs`):** Berjalan di lingkungan Node.js native untuk mengelola pembuatan window (`BrowserWindow`), mengontrol sesi PTY (terminal), melakukan operasi sistem berkas (filesystem), dan mem-proxy panggilan AI API.
2. **Preload Script (`src-electron/preload.cjs`):** Jembatan aman (*bridge*) yang mengekspos API Node.js dan IPC secara terbatas ke frontend React di bawah objek global `window.nyxide` menggunakan `contextBridge` dengan `contextIsolation` aktif.

### B. Fitur yang Telah Diimplementasikan
* **Operasi Berkas (Filesystem):** Handler IPC sinkron/asinkron untuk membaca file (`read-file`), menulis/menyimpan file (`write-file` / `createFile`), menghapus file (`delete-file`), mendaftar folder (`list-directory`), membuat direktori (`create-directory`), dan mencari file secara rekursif (`search-files`).
* **Dialog Sistem Native:** Jendela dialog untuk memilih folder proyek (`dialog:open-folder`) dan memilih file (`dialog:open-file`).
* **Terminal Pseudo-Terminal (PTY):** Integrasi sesi shell interaktif menggunakan library native `node-pty` di Main Process (mendukung shell `bash` di Linux/Unix dan `powershell.exe` di Windows) yang disalurkan ke frontend secara real-time.
* **AI API Proxy:** Handler IPC `ai:chat-stream` yang mem-proxy stream chat AI ke gateway Cloudflare (`https://slip-live-managed-python.trycloudflare.com/v1/chat/completions`) untuk menghindari masalah CORS di tingkat browser/renderer.
* **Manajemen Jendela & Menu:** Window berukuran 1400x900px, gaya `titleBarStyle: 'hidden'`, dan integrasi pintasan keyboard global (seperti `Ctrl+S`, `Ctrl+B`, `Ctrl+N`).

---

## 3. Arsitektur & Progres Sisi Frontend (React Process)

Antarmuka pengguna dibangun menggunakan **React 19** dan dikompilasi dengan **Vite 8**.

### A. Manajemen State UI
* **Workspace & Tab Editor:** Dikelola menggunakan React Context API (`src/context/AppContext.tsx`) untuk menyimpan file aktif, daftar tab yang terbuka, dan mendeteksi perubahan yang belum disimpan (*dirty tabs*).
* **AI Agent & Obrolan:** Zustand Store (`src/stores/aiStore.ts`) digunakan untuk menyimpan riwayat chat, status streaming, dan daftar pesan. Riwayat chat ini dipertahankan melalui `localStorage`.

### B. Komponen UI Utama
1. **Code Editor Monaco (`src/components/CodeEditor.tsx`):**
   * Menggunakan `@monaco-editor/react` bertema gelap (`vs-dark`).
   * Dilengkapi deteksi otomatis bahasa berdasarkan ekstensi file.
   * Autocomplete snippet kustom untuk HTML, PHP, JS, TS, Python, dan CSS (`src/utils/snippets.ts`).
   * Fitur tata letak otomatis, pelipatan kode, pewarnaan kurung, pemformatan dokumen (`Ctrl+Shift+I`), dan kursor halus.
2. **File Explorer (`src/components/FileExplorer.tsx`):**
   * Tree view hirarkis tanpa dependensi berat eksternal.
   * Memuat isi sub-folder secara dinamis (*lazy loading*) saat diklik menggunakan IPC `listDirectory`.
   * Integrasi ikon dinamis sesuai jenis ekstensi file.
   * Terhubung dengan global refresh handler `window.fileExplorerRefresh`.
3. **Terminal Panel (`src/components/Terminal.tsx`):**
   * Rendering terminal menggunakan library performa tinggi `xterm.js` beserta plugin `xterm-addon-fit`.
   * Mendukung input-output interaktif dua arah dan sinkronisasi ukuran baris/kolom otomatis via IPC `ptyResize`.
4. **Chat Panel (`src/components/ChatPanel.tsx`):**
   * Panel obrolan interaktif yang menampilkan daftar pesan, visualisasi proses streaming respons AI, dan opsi pemilihan model (Claude Opus 4.6, Gemini Pro Agent, Gemini 3.5 Flash High, GPT OSS 120B).

---

## 4. Integrasi AI Agent & Reasoning Loop

NyxIDE menerapkan agen pemecahan masalah mandiri (*Autonomous Agent*) yang tertanam langsung di dalam UI Chat Panel.

### A. Agen Reasoning Loop (Loop Berpikir)
1. **Pengiriman Konteks:** Ketika pengguna mengirim pesan, ia secara otomatis dibungkus dengan konteks direktori kerja aktif (*Working Directory*).
2. **Streaming & Tool Detection:** Obrolan dari LLM di-stream secara real-time. Jika respons selesai dan mengandung instruksi pemanggilan tool (*tool calls*), ChatPanel mem-parsing argumen fungsi dalam format JSON.
3. **Eksekusi Otomatis & Persetujuan Manual:**
   * **File Tools** (`readFile`, `writeFile`, `createFile`, `deleteFile`, `listDirectory`) dieksekusi secara otomatis di latar belakang.
   * **Terminal Tools** (`run_terminal_command`) dihentikan sementara untuk keamanan (*human-in-the-loop*), meminta persetujuan pengguna (tombol Run/Cancel) sebelum dieksekusi.
4. **Umpan Balik AI:** Hasil eksekusi dikemas menjadi pesan baru dengan role `'tool'` dan dikirim kembali ke AI untuk memicu iterasi pemanggilan berikutnya (maksimal 5 iterasi) agar AI bisa melanjutkan pekerjaan secara mandiri.
5. **Penyegaran Tampilan:** Setelah memproses perubahan file, aplikasi otomatis menyegarkan tab Monaco editor (`window.nyxideRefreshTab`) dan Explorer Tree (`window.fileExplorerRefresh`).

### B. Pembatasan Penggunaan Tool (Tool Guardrails)
Telah ditambahkan instruksi ketat pada System Prompt (`src/config/aiConfig.ts`):
* AI dilarang keras memanggil tool secara proaktif pada pesan sapaan sederhana (seperti "halo", "hello", "hi") atau pertanyaan teoretis umum.
* AI wajib langsung membalas sapaan tersebut secara tekstual, mencegah munculnya visualisasi tool call yang tidak perlu.

---

## 5. Ringkasan Status Progres Fitur

| Fitur / Modul | Status | Keterangan |
| :--- | :--- | :--- |
| **Arsitektur Multi-Proses** | Selesai | Pemisahan proses utama (Main) dan renderer dengan isolasi konteks penuh. |
| **Integrasi File System** | Selesai | IPC CRUD file & list direktori berjalan 100%. |
| **Editor Monaco & Snippets** | Selesai | Autocomplete snippet kustom PHP/HTML/JS/TS/Python/CSS berfungsi. |
| **File Explorer Tree** | Selesai | Navigasi direktori dinamis dengan lazy-loading. |
| **Terminal Emulator** | Selesai | Terminal xterm.js interaktif terikat dengan node-pty. |
| **AI Stream Gateway** | Selesai | Proxy streaming AI via IPC sukses memintas CORS. |
| **Agent Reasoning Loop** | Selesai | Siklus pemecahan masalah mandiri (multi-turn tool calling) berfungsi dengan batas 5 iterasi. |
| **Security Guardrails** | Selesai | Proteksi sapaan agar tidak memanggil tool dan konfirmasi manual untuk perintah terminal. |
| **Build System** | Selesai | Menggunakan `electron-builder` menghasilkan file paket `.AppImage`. |
