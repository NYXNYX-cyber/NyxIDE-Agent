import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to avoid CORS issues
      '/api': {
        target: 'https://slip-live-managed-python.trycloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Handle ai SDK dependencies properly
      external: ['ai'],
    },
  },
})
