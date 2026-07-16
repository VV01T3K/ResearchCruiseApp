import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite-plus';
// import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import viteReact from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
// import babel from '@rolldown/plugin-babel';
import { fmtConfig, lintConfig } from './vite.tool.config.ts';

const {
  SENTRY_AUTH_TOKEN: sentryAuthToken,
  SENTRY_ORG: sentryOrg,
  SENTRY_PROJECT: sentryProject,
  SENTRY_RELEASE: sentryRelease,
} = process.env;

const sentryPlugin =
  sentryAuthToken && sentryOrg && sentryProject
    ? sentryVitePlugin({
        authToken: sentryAuthToken,
        org: sentryOrg,
        project: sentryProject,
        release: { name: sentryRelease },
        sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
      })
    : undefined;

export default defineConfig({
  staged: {
    // TODO: put in the tool.config like the rest
    '*.{js,jsx,ts,tsx,css,html,json,md,yml,yaml}': 'vp fmt --write',
  },
  lint: lintConfig,
  fmt: fmtConfig,
  server: {
    host: true, // TODO: set only for development, not for production build
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter(),
    viteReact(),
    tailwindcss(),
    sentryPlugin,
    // babel({ // Breaks tests and some forms etc FIXME: Re-enable and fix
    //   presets: [reactCompilerPreset()],
    // }),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    API_URL: JSON.stringify(process.env.API_URL),
    APP_ENVIRONMENT: JSON.stringify(process.env.APP_ENVIRONMENT),
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN ?? ''),
    SENTRY_RELEASE: JSON.stringify(sentryRelease ?? ''),
    SENTRY_TRACES_SAMPLE_RATE: JSON.stringify(process.env.SENTRY_TRACES_SAMPLE_RATE ?? ''),
    SENTRY_REPLAYS_SESSION_SAMPLE_RATE: JSON.stringify(process.env.SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? ''),
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: sentryPlugin ? 'hidden' : false,
  },
});
