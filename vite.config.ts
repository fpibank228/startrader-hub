
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Define the configuration in a more compatible way
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ['.ngrok-free.app']
  },
  plugins: [
    react(),
    process.env.NODE_ENV !== 'production' && componentTagger(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
