import { defineConfig } from 'vite';
import { angular } from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

// Please run this
// npm install vite @vitejs/plugin-angular --save-dev
// Then this
// vite build
// vite preview
// Then to github pages or even my site
