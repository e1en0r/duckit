import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: /^assets\//, replacement: '/src/assets/' },
      { find: /^components\//, replacement: '/src/components/' },
      { find: /^config\//, replacement: '/src/config/' },
      { find: /^context\//, replacement: '/src/context/' },
      { find: /^hooks\//, replacement: '/src/hooks/' },
      { find: /^icons\//, replacement: '/src/icons/' },
      { find: /^modals\//, replacement: '/src/modals/' },
      { find: /^pages\//, replacement: '/src/pages/' },
      { find: /^postcss\//, replacement: '/src/postcss/' },
      { find: /^styles\//, replacement: '/src/styles/' },
      { find: /^utils\//, replacement: '/src/utils/' },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
