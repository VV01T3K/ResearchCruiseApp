import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  outputDir: './test-results/application',
  testDir: './tests',
  testIgnore: 'unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 20_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'journeys',
      testDir: './tests/browser',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regressions',
      testIgnore: ['unit/**', 'browser/**'],
      timeout: 60_000,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:5174' },
    },
  ],
  webServer: [
    {
      command:
        'vp build --mode test --outDir dist-test && vp preview --outDir dist-test --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      timeout: 90_000,
      env: { API_URL: '/api', APP_ENVIRONMENT: 'test', SENTRY_DSN: '', SENTRY_AUTH_TOKEN: '' },
    },
    {
      command: 'vp dev --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: false,
      timeout: 90_000,
      env: { API_URL: '/api', APP_ENVIRONMENT: 'test', SENTRY_DSN: '', SENTRY_AUTH_TOKEN: '' },
    },
  ],
});
