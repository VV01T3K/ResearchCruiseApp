import { defineConfig } from 'vite-plus';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';
import { fmtConfig, lintConfig } from './vite.tool.config.ts';

export default defineConfig({
  lint: lintConfig,
  fmt: fmtConfig,
  server: {
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    svgr({
      svgrOptions: {
        icon: '100%',
      },
    }),
    tanstackRouter(),
    viteReact(),
    tailwindcss(),
    // babel({ // Breaks tests and some forms etc FIXME: Re-enable and fix
    //   presets: [reactCompilerPreset()],
    // }),
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
