import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isGH = process.env.GITHUB_PAGES === 'true';
const REPO_NAME = 'BraveVest';

export default defineConfig({
  plugins: [react()],
  base: isGH ? '/' + REPO_NAME + '/' : '/',
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 5173, open: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts':       ['recharts'],
          'http':         ['axios'],
        },
      },
    },
  },
});
