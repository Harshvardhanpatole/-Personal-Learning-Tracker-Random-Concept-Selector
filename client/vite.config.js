import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  css: { postcss: path.join(root, 'postcss.config.js') },
  server: { port: 5173, proxy: { '/api': 'http://localhost:4000' } },
});
