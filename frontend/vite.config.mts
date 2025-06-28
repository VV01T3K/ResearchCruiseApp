import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        icon: '100%',
      },
    }),
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    API_URL: JSON.stringify(process.env.API_URL),
    APP_ENVIRONMENT: JSON.stringify(process.env.APP_ENVIRONMENT),
    OTEL_SERVICE_NAME: JSON.stringify(process.env.OTEL_SERVICE_NAME),
    GRAFANA_FARO_URL: JSON.stringify(process.env.GRAFANA_FARO_URL),
  },
  build: { chunkSizeWarningLimit: 2000 },
});
