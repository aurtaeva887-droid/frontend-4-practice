import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import apiPlugin from './server/server.js'

export default defineConfig({
  plugins: [react(), apiPlugin()],
})