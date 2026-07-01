import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const elevenLabsWebSocketVendor = path.resolve(
  __dirname,
  'src/lib/elevenlabs/WebSocketConnection.js',
);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          socialPreview: path.resolve(__dirname, 'social-preview.html'),
        },
      },
    },
    resolve: {
      alias: [
        {find: '@', replacement: path.resolve(__dirname, '.')},
        {
          find: '@elevenlabs/client/dist/utils/WebSocketConnection.js',
          replacement: elevenLabsWebSocketVendor,
        },
      ],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Dev: proxy /api to local Express. Prod uses VITE_API_BASE_URL (see src/lib/apiBase.ts).
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${process.env.AGENT_V3_SERVER_PORT ?? '8787'}`,
          changeOrigin: true,
        },
      },
    },
  };
});
