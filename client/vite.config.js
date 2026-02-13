import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5840,
    proxy: {
      '/auth': 'http://localhost:5150',
      '/api': 'http://localhost:5150'
    }
  }
})
