import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import {api_proxy_addr, img_proxy_addr, dest_root} from "./target_config"

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
        configure: (proxy) => {
          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем все источники
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); // Указываем методы
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // Указываем допустимые заголовки
          });

          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.method === 'OPTIONS') {
              proxyReq.setHeader('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
            }
          });
        },
        
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, "/"),
      },
    }, 
  },
  base: dest_root,
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'), // используйте '@' как алиас для 'src'
    },
  },
  
})