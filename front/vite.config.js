// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:8123', // 🟡 백엔드 포트 반드시 확인
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});