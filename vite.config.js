
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
})

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

// import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';
// import fs from 'fs';
// import path from 'path';
// import react from '@vitejs/plugin-react';

// // Read package.json to extract dependencies (optional, if needed)
// const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// // List the specific libraries you want to externalize (optional)
// const externalLibraries = [
//   'react',
//   'react-dom',
//   'react-redux',
//   'react-router-dom',
//   'react-table',
//   'react-icons',
//   'chart.js',
//   'react-chartjs-2',
//   'react-toastify',
//   'react-bootstrap',
//   'lucide-react',
//   'reactstrap',
//   'reselect',
//   'axios',
//   'cors',
//   'tailwindcss'
// ];



// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       // Externalize certain libraries to prevent bundling them into your final build
//       external: externalLibraries,  // Only externalize the libraries you want
//     },
//     outDir: 'dist', // Set output directory to 'dist'
//   },
//   css: {
//     postcss: './postcss.config.js', // Link to PostCSS config if needed
//   },
//   define: {
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // Ensure environment variables are handled
//   },
//   server: {
//     // If you are going for local imports (no CDN)
//     // No proxy needed for CDNs, but you can configure proxy here for local API calls if needed
//     // Example:
//     // proxy: {
//     //   '/api': 'http://localhost:5000',
//     // },
//   },
// });

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';
// import path from 'path';

// // Read the package.json file
// const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// // Extract the dependencies (including devDependencies if necessary)
// const dependencies = Object.keys(packageJson.dependencies);
// const devDependencies = Object.keys(packageJson.devDependencies);

// // Combine both dependencies and devDependencies into one list for externalization
// const allDependencies = [...dependencies, ...devDependencies];

// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: './postcss.config.js',  // Explicitly link to the PostCSS config
//   },
//   build: {
//     rollupOptions: {
//       external: [
//         ...allDependencies, // Externalize all dependencies and devDependencies
//         'react', // Explicitly ensure these libraries are external too if needed
//         'react-dom',
//         'react-redux',
//         'react-router-dom',
//         'react-table',
//         'react-icons',
//         'chart.js',
//         'react-chartjs-2',
//         'react-toastify',
//         'react-bootstrap',
//         'lucide-react', 
//         'reactstrap', 
//         'reselect',
//         'axios',
//         'cors',
//         'tailwindcss',
//       ],
//     },
//     outDir: 'dist', // Make sure your output directory is set (default is 'dist')
//   },
//   define: {
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // Ensure environment variables are correctly handled
//   },
//   server: {
//     // Proxy CDN requests during local development
//     proxy: Object.fromEntries(
//       allDependencies.map(dep => [
//         `/${dep}`,
//         `https://cdn.skypack.dev/${dep}`,
//       ])
//     ),
//   },
// });
