
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Use process.cwd() from the imported process module to ensure the project root is correctly identified
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expose the API keys as a full object to support dynamic access like process.env[keyName]
      'process.env': JSON.stringify({
        GEMINI_API_KEY: env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '',
        GEMINI_API_KEY2: env.GEMINI_API_KEY2 || env.VITE_GEMINI_API_KEY2 || '',
        API_KEY: env.API_KEY || env.GEMINI_API_KEY || ''
      })
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
    }
  };
});
