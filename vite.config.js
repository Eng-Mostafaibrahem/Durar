import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    // Pre-bundle at startup so newly imported icon packages (or any dep) never
    // trigger a mid-session re-optimization ("Outdated Optimize Dep" 504).
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'i18next-browser-languagedetector',
      '@tanstack/react-query',
      'react-hook-form',
      'react-helmet-async',
      'react-icons/hi2',
      'react-icons/fa',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Route-level React.lazy splitting is the splitting strategy; vendor
    // grouping is left to the bundler's defaults.
  },
});
