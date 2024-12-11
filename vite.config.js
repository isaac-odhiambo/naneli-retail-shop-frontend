// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
//   },
//   build: {
//     rollupOptions: {
//       external: ['react-chartjs-2', 'chart.js'],  // Externalize react-chartjs-2 and chart.js
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Read package.json dependencies
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const dependencies = Object.keys(packageJson.dependencies);

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
  },
  build: {
    rollupOptions: {
      external: [
        ...dependencies,  // Externalize all dependencies listed in package.json
      ],
    },
  },
});