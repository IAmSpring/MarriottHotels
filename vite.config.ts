import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
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
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@headlessui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('react-datepicker') || id.includes('date-fns')) {
              return 'date-vendor';
            }
            if (id.includes('openai')) {
              return 'openai-vendor';
            }
            return 'vendor';
          }

          // App chunks
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/utils/') || id.includes('/src/lib/')) {
            return 'utils';
          }
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
      },
      input: path.resolve(__dirname, 'index.html')
    },
    chunkSizeWarningLimit: 1000,
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
