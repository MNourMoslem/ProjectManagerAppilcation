import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Optimize build for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'date-fns', 'zustand']
        }
      }
    }
  },
  // Environment variables configuration
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  // Server configuration for development
  server: {
    port: 5173,
    host: true,
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  }
})
