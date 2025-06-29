import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react({
    jsxRuntime: 'automatic',
    fastRefresh: true,
  })],
  base: command === 'serve' ? '/' : '/MarriottHotels/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer'
    },
  },
  server: {
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    fs: {
      strict: false
    },
    hmr: {
      host: 'localhost'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', 'lucide-react'],
          'date-vendor': ['react-datepicker', 'date-fns'],
          'openai-vendor': ['openai']
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const extType = assetInfo.name.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/img/[name]-[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: true,
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
      'openai'
    ],
    exclude: [
      '@stripe/stripe-js',
      '@trpc/client',
      '@trpc/react-query',
      'socket.io-client'
    ]
  },
  define: {
    'process.env': {},
    ...(command === 'build' ? {
      'import.meta.env.VITE_STATIC_BUILD': JSON.stringify('true'),
      'import.meta.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
      'import.meta.env.AI_ASSISTANT_ID': JSON.stringify(process.env.AI_ASSISTANT_ID || ''),
      'import.meta.env.AI_ADMIN_ID': JSON.stringify(process.env.AI_ADMIN_ID || ''),
      'import.meta.env.ENABLE_AI_CHAT': JSON.stringify(process.env.ENABLE_AI_CHAT || 'true'),
    } : {})
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md']
}));
