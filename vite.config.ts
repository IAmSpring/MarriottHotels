import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  base: command === 'serve' ? '/' : '/MarriottHotels/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'buffer': 'buffer',
      // Add aliases for Node built-ins to handle browser compatibility
      'fs': false,
      'util': false,
      'winston': false,
      'prom-client': false
    },
  },
  server: {
    host: 'localhost',
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
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
      'socket.io-client',
      // Add Node.js built-ins to exclude list
      'fs',
      'util',
      'winston',
      'prom-client'
    ]
  },
  define: {
    'process.env': {},
    ...(command === 'build' ? {
      'import.meta.env.VITE_STATIC_BUILD': JSON.stringify('true'),
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify('demo-key'),
      'import.meta.env.VITE_AI_ASSISTANT_ID': JSON.stringify('demo-assistant'),
      'import.meta.env.VITE_AI_ADMIN_ID': JSON.stringify('demo-admin'),
      'import.meta.env.VITE_ENABLE_AI_CHAT': JSON.stringify('true'),
      'import.meta.env.VITE_IS_DEMO': JSON.stringify('true')
    } : {})
  },
  publicDir: 'public',
  assetsInclude: ['**/*.md']
}));
