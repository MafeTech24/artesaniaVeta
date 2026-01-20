import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Proxy para evitar CORS en desarrollo y para NO exponer la API Key en el frontend.
      proxy: {
        '/api': 'http://localhost:8787',
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
