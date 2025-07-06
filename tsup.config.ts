import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server/server.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  splitting: true,
  dts: true,
  treeshake: true,
  bundle: true,
  minify: false,
  outDir: 'dist',
  tsconfig: 'tsconfig.server.json',
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
}); 