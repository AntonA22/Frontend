import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://172.20.10.11:8000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    }, 
  },
  base: "/starship_flights_frontend",
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'), // используйте '@' как алиас для 'src'
    },
  },
  
})