import path from 'path';
import type { Plugin } from 'vite';

/**
 * Forces `./BaseConversation.js` imports that originate inside `node_modules/@elevenlabs/client/dist/**`
 * to resolve to our vendored patch file. Plain resolve.alias often misses these relative imports during Rollup.
 */
export function elevenLabsBaseConversationVendorPlugin(vendorFileAbsolute: string): Plugin {
  const normalizedVendor = path.normalize(vendorFileAbsolute);
  return {
    name: 'elevenlabs-baseconversation-vendor',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source !== './BaseConversation.js' || !importer) return null;
      const importerPosix = importer.replace(/\\/g, '/');
      if (!importerPosix.includes('/@elevenlabs/client/dist/')) return null;
      return normalizedVendor;
    },
  };
}
