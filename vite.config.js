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

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// Extract the dependencies (including devDependencies if necessary)
const dependencies = Object.keys(packageJson.dependencies);

// Combine only dependencies (not devDependencies) into one list for externalization
const allDependencies = [...dependencies];

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
  },
  build: {
    outDir: 'dist',  // Specify the output directory
    rollupOptions: {
      external: allDependencies.filter(dep => dep !== 'react' && dep !== 'react-dom'), // Exclude entry point and essential dependencies from externalization
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // Ensure environment variables are correctly handled
  },
  server: {
    // This is required to proxy CDNs during local development
    proxy: Object.fromEntries(
      allDependencies.map(dep => [
        `/${dep}`,
        `https://cdn.skypack.dev/${dep}`,
      ])
    ),
  },
});


