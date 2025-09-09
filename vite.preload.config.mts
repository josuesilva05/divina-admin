import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'electron',
        'sql.js',
        'fs',
        'path',
        'util',
        'os'
      ],
      output: {
        format: 'cjs',
      },
    },
    target: 'node18',
  },
});
