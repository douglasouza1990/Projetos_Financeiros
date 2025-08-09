import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify('0.0.0')
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
