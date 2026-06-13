// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'  // your partner's FastAPI
    }
  }
})