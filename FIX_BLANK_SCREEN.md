# 🔧 Fix Blank Screen - Instructions

## Problem
Aplikasi menampilkan blank screen dengan error di console:
```
Uncaught SyntaxError: The requested module '/src/stores/aiStore.ts' does not provide an export named 'AIMessage'
```

## Solution

### Step 1: Stop Semua Dev Server
```bash
# Kill semua process yang related
pkill -f "vite"
pkill -f "electron"
pkill -f "node.*nyxide"

# Tunggu 2 detik
sleep 2
```

### Step 2: Clear All Caches
```bash
cd /home/nyx/Documents/nyxide

# Clear Vite cache
rm -rf node_modules/.vite

# Clear build output
rm -rf dist

# Clear electron build
rm -rf release
```

### Step 3: Rebuild & Start Fresh
```bash
# Install dependencies (jika ada yang missing)
npm install

# Start dev server fresh
npm run dev
```

### Step 4: Hard Refresh Browser
Ketika app sudah jalan:
1. Buka Developer Console (Ctrl+Shift+I atau F12)
2. Klik kanan tombol refresh di browser
3. Pilih **"Empty Cache and Hard Reload"**

Atau tekan: `Ctrl+Shift+R`

### Step 5: Verify
Setelah restart, cek:
- ✅ Sidebar kiri menampilkan ChatPanel (bukan blank)
- ✅ Tidak ada error di console
- ✅ Bisa type message dan kirim
- ✅ Streaming response muncul word-by-word

## Jika Masih Error

Screenshot lagi dan cek error di console. Error yang mungkin:

1. **Network Error** - API endpoint tidak reachable
2. **CORS Error** - Perlu configure CORS di server
3. **Auth Error** - API key salah

## Quick Test Command
```bash
# Test apakah API reachable
curl -X POST http://157.245.196.165:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-7c385384dc41adf3-8s0uu8-02500fae" \
  -H "Content-Type: application/json" \
  -d '{"model":"gc/gemini-3.1-pro-preview","messages":[{"role":"user","content":"hello"}]}'
```

Jika return JSON response, API working!
