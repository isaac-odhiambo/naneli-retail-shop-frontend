import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
  },
  build: {
    rollupOptions: {
      external: ['react-chartjs-2', 'chart.js'],  // Externalize react-chartjs-2 and chart.js
    },
  },
});

