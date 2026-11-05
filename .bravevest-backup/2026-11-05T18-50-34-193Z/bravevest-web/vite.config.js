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
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'react-vendor';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('axios')) return 'http';
          }
          if (id.includes('/pages/admin/')) return 'admin-pages';
          if (id.includes('/pages/investor/')) return 'investor-pages';
        },
      },
    },
  },
});
