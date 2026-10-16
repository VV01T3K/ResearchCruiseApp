import { createHash } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

// Each checkout gets its own stable port, so suites in different worktrees can run at the same
// time. Set PLAYWRIGHT_PORT to choose one explicitly.
const hash = createHash('sha1')
  .update(import.meta.dirname)
  .digest();
process.env.PLAYWRIGHT_PORT ??= String(4300 + (hash.readUInt16BE(0) % 1000));
const baseURL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT}`;

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A quarter of the cores leaves room for a second suite running in another worktree.
  workers: process.env.CI ? 1 : '25%',
  timeout: 20_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `vp build --mode test --outDir dist-test && vp preview --outDir dist-test --host 127.0.0.1 --port ${process.env.PLAYWRIGHT_PORT} --strictPort`,
    url: baseURL,
    timeout: 60_000,
    env: { API_URL: '/api', APP_ENVIRONMENT: 'test', SENTRY_DSN: '', SENTRY_AUTH_TOKEN: '' },
  },
});
