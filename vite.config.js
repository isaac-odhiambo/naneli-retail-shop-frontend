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

// Extract the dependencies (you can also include devDependencies if necessary)
const dependencies = Object.keys(packageJson.dependencies);

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
  },
  build: {
    rollupOptions: {
      external: [
        ...dependencies, // Include all dependencies as external
        'react', // You can explicitly ensure these libraries are external too if needed
        'react-dom',
        'react-redux',
        'react-router-dom',
        'react-table',
        'react-icons',
        'chart.js',
        'react-chartjs-2',
        'react-toastify',
        'react-bootstrap',
        'lucide-react', 
        'reactstrap', 
        'reselect',
        'axios',
        'cors',
        'tailwindcss',
      ],
    },
  },
});

