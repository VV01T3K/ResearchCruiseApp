import { readFileSync } from 'node:fs';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, lazyPlugins } from 'vite-plus';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from 'vite-plus/test/browser-playwright';
import { fmtConfig, lintConfig } from './vite.tool.config.ts';

const {
  SENTRY_AUTH_TOKEN: sentryAuthToken,
  SENTRY_ORG: sentryOrg,
  SENTRY_PROJECT: sentryProject,
  SENTRY_RELEASE: sentryRelease,
} = process.env;

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version?: unknown;
  repository?: unknown;
};
if (typeof packageJson.version !== 'string' || !packageJson.version) {
  throw new Error('frontend/package.json has no version to show in the app');
}
if (typeof packageJson.repository !== 'string' || !packageJson.repository) {
  throw new Error('frontend/package.json has no repository URL to link from the app');
}

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
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.{ts,tsx}'],
          // Match the users' and the browser tests' timezone, whatever the machine's own is.
          env: { TZ: 'Europe/Warsaw' },
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook', storybookScript: 'vp run storybook --no-open' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
  server: {
    host: true, // TODO: set only for development, not for production build
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    svgr({
      svgrOptions: {
        icon: '100%',
      },
    }),
    tanstackRouter(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    sentryPlugin,
  ]),
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    APP_REPOSITORY_URL: JSON.stringify(packageJson.repository),
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
