import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist']
  },
  build: {
    commonjsOptions: {
      include: [/react-pdf/, /pdfjs-dist/]
    }
  }
})
