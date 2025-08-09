import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin para gerar versão automática
const versionPlugin = () => {
  return {
    name: 'version-plugin',
    config(config: any) {
      // Gerar versão baseada em timestamp + build number
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      
      const timestamp = `${year}${month}${day}-${hour}${minute}`;
      
      // Build number baseado em timestamp unix (últimos 4 dígitos)
      const buildNumber = Math.floor(Date.now() / 1000).toString().slice(-4);
      
      const version = `v${timestamp}.${buildNumber}`;
      
      config.define = config.define || {};
      config.define.__APP_VERSION__ = JSON.stringify(version);
      
      console.log(`🚀 Generating version: ${version}`);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
