import { createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { availableParallelism } from 'node:os';
import { defineConfig, devices } from '@playwright/test';

/** The first port from `start` that nothing is listening on. */
async function freePort(start: number) {
  for (let port = start; port < start + 100; port++) {
    const free = await new Promise<boolean>((resolve) => {
      const server = createServer()
        .once('error', () => resolve(false))
        .listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
    });
    if (free) return port;
  }
  throw new Error(`No free port in ${start}-${start + 99}; set PLAYWRIGHT_PORT.`);
}

// Each checkout starts from its own port, so suites in different worktrees can run at the same
// time. Workers inherit the chosen port from the environment. Set PLAYWRIGHT_PORT to pick one.
// 20000-24999 is above every port Chromium refuses to load (ERR_UNSAFE_PORT, up to 10080) and
// below Linux's ephemeral range.
const hash = createHash('sha1')
  .update(import.meta.dirname)
  .digest();
process.env.PLAYWRIGHT_PORT ??= String(await freePort(20000 + (hash.readUInt16BE(0) % 5000)));
const baseURL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT}`;

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A quarter of the CPUs leaves room for a second suite in another worktree. Unlike '25%', which
  // counts the host's cores, availableParallelism() respects a container's CPU limit.
  workers: process.env.CI ? 1 : Math.max(1, Math.floor(availableParallelism() / 4)),
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
