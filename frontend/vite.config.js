import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000, // Optional: Specify a port, like 3000
  },
});
