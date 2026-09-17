import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://atulkhatri.github.io/dtp-webapp/
export default defineConfig({
  plugins: [react()],
  base: '/dtp-webapp/',
  preview: {
    host: true,
    allowedHosts: true,
  },
  server: {
    host: true,
    allowedHosts: true,
  },
})
