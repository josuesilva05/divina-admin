import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: [
        'electron',
        'sql.js',
        'fs',
        'path',
        'util',
        'os',
        'crypto',
        'buffer',
        'stream',
        'events',
        'assert',
        'child_process',
        'url',
        'querystring',
        'zlib',
        /^node:/
      ],
      output: {
        format: 'cjs'
      }
    },
    target: 'node18',
    minify: false,
    sourcemap: true
  },
})
