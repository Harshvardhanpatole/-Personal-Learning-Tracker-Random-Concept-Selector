import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [path.join(root, 'index.html'), path.join(root, 'src/**/*.{js,jsx}')],
  theme: {
    extend: {
      fontFamily: { display: ['Poppins', 'Arial', 'sans-serif'], body: ['Arial', 'sans-serif'] },
      colors: { ink: '#07162e', panel: '#0d2040', cyan: '#2dd4e8' },
      boxShadow: { soft: '0 18px 50px rgba(7, 22, 46, 0.10)' },
    },
  },
  plugins: [],
};
