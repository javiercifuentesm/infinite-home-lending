import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { elevenLabsBaseConversationVendorPlugin } from './vite-plugin-elevenlabs-baseconversation-vendor';

const elevenLabsWebSocketVendor = path.resolve(
  __dirname,
  'src/lib/elevenlabs/WebSocketConnection.js',
);
const elevenLabsBaseConversationVendor = path.resolve(
  __dirname,
  'src/lib/elevenlabs/BaseConversation.js',
);
const elevenLabsBaseConversationSdk = path.resolve(
  __dirname,
  'node_modules/@elevenlabs/client/dist/BaseConversation.js',
);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      elevenLabsBaseConversationVendorPlugin(elevenLabsBaseConversationVendor),
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    // Pre-bundling @elevenlabs/client can bake in the stock BaseConversation before resolve.alias runs.
    optimizeDeps: {
      exclude: ['@elevenlabs/client'],
    },
    resolve: {
      alias: [
        {find: '@', replacement: path.resolve(__dirname, '.')},
        {
          find: '@elevenlabs/client/dist/utils/WebSocketConnection.js',
          replacement: elevenLabsWebSocketVendor,
        },
        // SDK ships BaseConversation at dist/BaseConversation.js (not under dist/utils/).
        {
          find: '@elevenlabs/client/dist/BaseConversation.js',
          replacement: elevenLabsBaseConversationVendor,
        },
        {
          find: '@elevenlabs/client/dist/utils/BaseConversation.js',
          replacement: elevenLabsBaseConversationVendor,
        },
        {
          find: elevenLabsBaseConversationSdk,
          replacement: elevenLabsBaseConversationVendor,
        },
        // Bundlers resolve this dep to an absolute path under node_modules; string aliases above miss it.
        {
          find: /[/\\]node_modules[/\\]@elevenlabs[/\\]client[/\\]dist[/\\]BaseConversation\.js$/,
          replacement: elevenLabsBaseConversationVendor,
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
