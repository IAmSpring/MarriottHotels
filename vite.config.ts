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
      }
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
    },
    chunkSizeWarningLimit: 800,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
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
  }
});
