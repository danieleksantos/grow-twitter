import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api', ''),
      },
    },
  },
})
