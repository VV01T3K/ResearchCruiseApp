import { availableParallelism } from 'node:os';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A quarter of the CPUs leaves room for a suite running in another worktree. availableParallelism()
  // respects a container's CPU limit, which Playwright's percentage setting does not.
  workers: process.env.CI ? 1 : Math.max(1, Math.floor(availableParallelism() / 4)),
  timeout: 20_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    // Set from the preview server's output once it has started.
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Port 0 lets the system choose a free port, so suites in several worktrees can run at once.
    command: 'vp build --mode test --outDir dist-test && vp preview --outDir dist-test --host 127.0.0.1 --port 0',
    wait: { stdout: /(?<playwright_base_url>http:\/\/127\.0\.0\.1:\d+)/ },
    timeout: 60_000,
    env: { API_URL: '/api', APP_ENVIRONMENT: 'test', SENTRY_DSN: '', SENTRY_AUTH_TOKEN: '' },
  },
});
