import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite-plus';
// import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import viteReact from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
// import babel from '@rolldown/plugin-babel';
import { fmtConfig, lintConfig } from './vite.tool.config.ts';

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const frontendReleasePrefix = 'research-cruise-app-frontend@';

function normalizeFrontendRelease(release?: string): string | undefined {
  if (release) {
    return release.startsWith(frontendReleasePrefix) ? release : `${frontendReleasePrefix}${release}`;
  }

  return undefined;
}

const sentryRelease = normalizeFrontendRelease(process.env.SENTRY_RELEASE);

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
    svgr({
      svgrOptions: {
        icon: '100%',
      },
    }),
    tanstackRouter(),
    viteReact(),
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
              filesToDeleteAfterUpload: ['./dist/**/*.map'],
            },
          }),
        ]
      : []),
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
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: sentryAuthToken && sentryOrg && sentryProject ? 'hidden' : false,
  },
});
