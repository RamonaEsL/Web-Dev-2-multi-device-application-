import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite settings for the React client.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
