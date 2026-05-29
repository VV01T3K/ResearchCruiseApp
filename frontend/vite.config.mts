import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryRelease =
  process.env.SENTRY_RELEASE ?? process.env.GITHUB_SHA ?? process.env.npm_package_version;

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        icon: '100%',
      },
    }),
    tanstackRouter(),
    react(),
    tailwindcss(),
    ...(sentryAuthToken && sentryOrg && sentryProject
      ? [
          sentryVitePlugin({
            org: sentryOrg,
            project: sentryProject,
            authToken: sentryAuthToken,
            release: {
              name: sentryRelease,
            },
            sourcemaps: {
              filesToDeleteAfterUpload: ['**/*.map'],
            },
          }),
        ]
      : []),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    API_URL: JSON.stringify(process.env.API_URL),
    APP_ENVIRONMENT: JSON.stringify(process.env.APP_ENVIRONMENT),
    OTEL_SERVICE_NAME: JSON.stringify(process.env.OTEL_SERVICE_NAME),
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN ?? ''),
    SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT ?? process.env.APP_ENVIRONMENT),
    SENTRY_RELEASE: JSON.stringify(sentryRelease ?? ''),
    SENTRY_TRACES_SAMPLE_RATE: JSON.stringify(process.env.SENTRY_TRACES_SAMPLE_RATE ?? ''),
    SENTRY_REPLAYS_SESSION_SAMPLE_RATE: JSON.stringify(
      process.env.SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? ''
    ),
    SENTRY_TUNNEL: JSON.stringify(process.env.SENTRY_TUNNEL ?? ''),
    SENTRY_DEBUG: JSON.stringify(process.env.SENTRY_DEBUG ?? 'false'),
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: sentryAuthToken ? 'hidden' : false,
  },
});
