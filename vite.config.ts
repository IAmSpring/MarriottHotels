import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MarriottHotels/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
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
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs/index.html')
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
      '@': resolve(__dirname, './src'),
      '@docs': resolve(__dirname, './docs')
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
    'process.env': {}
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md']
});
