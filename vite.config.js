import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/nostr-get-luck-account/',
  plugins: [react()],
  build:{outDir:'docs',}
})
