import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  },
  define: {
    'import.meta.env.VITE_POKER_SERVER_URL': JSON.stringify(
      process.env.VITE_POKER_SERVER_URL || 'http://localhost:3001'
    )
  }
})