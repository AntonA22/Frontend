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
        target: "http://192.168.1.65:8000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    }, 
  },
  base: "/Frontend",
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'), // используйте '@' как алиас для 'src'
    },
  },
  
})