import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MarriottHotels/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', './public']
    },
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', 'lucide-react'],
          'date-vendor': ['react-datepicker', 'date-fns'],
          'stripe-vendor': ['@stripe/stripe-js'],
          'trpc-vendor': ['@trpc/client', '@trpc/react-query', '@trpc/server'],
        },
      },
      input: {
        main: path.resolve(__dirname, 'index.html'),
        docs: path.resolve(__dirname, 'docs/index.html')
      }
    },
    chunkSizeWarningLimit: 800,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@docs': path.resolve(__dirname, './docs')
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      'lucide-react',
      'react-datepicker',
      '@stripe/stripe-js',
      '@trpc/client',
      '@trpc/react-query',
    ],
  },
  define: {
    'process.env': {},
    'import.meta.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
    'import.meta.env.AI_ASSISTANT_ID': JSON.stringify(process.env.AI_ASSISTANT_ID || ''),
    'import.meta.env.AI_ADMIN_ID': JSON.stringify(process.env.AI_ADMIN_ID || ''),
    'import.meta.env.ENABLE_AI_CHAT': JSON.stringify(process.env.ENABLE_AI_CHAT || 'true'),
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md']
});
