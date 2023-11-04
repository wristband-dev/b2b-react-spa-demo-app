import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist',
    rollupOptions: {
      /**
       * Ignore "use client" waning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react({ include: ['**/*.jsx', '**/*.tsx'] }), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 6001,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: false,
        secure: false,
        headers: { Connection: 'keep-alive' },
      },
    },
  },
});
