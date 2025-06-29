import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MarriottHotels/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      }
    },
    fs: {
      strict: false
    },
    hmr: {
      clientPort: 5173,
      path: 'ws'
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
          'socket-vendor': ['socket.io-client'],
        },
      },
      input: path.resolve(__dirname, 'index.html')
    },
    chunkSizeWarningLimit: 800,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    outDir: 'dist'
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
      'socket.io-client',
    ],
  },
  define: {
    'process.env': {},
    // Use environment variables with fallbacks for production
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
    'import.meta.env.VITE_AI_ASSISTANT_ID': JSON.stringify(process.env.AI_ASSISTANT_ID || ''),
    'import.meta.env.VITE_AI_ADMIN_ID': JSON.stringify(process.env.AI_ADMIN_ID || ''),
    'import.meta.env.VITE_ENABLE_AI_CHAT': JSON.stringify(process.env.ENABLE_AI_CHAT || 'true'),
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md']
});
