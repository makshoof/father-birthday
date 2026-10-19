import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', 'framer-motion', 'lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
