import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import base from '../playwright.config';

export default defineConfig({
  ...base,
  testDir: '.',
  outputDir: '../../artifacts/forms-review',
  workers: 1,
  retries: 0,
  timeout: 120_000,
  projects: base.projects?.map((project) => ({
    ...project,
    use: { ...project.use, viewport: { width: 1440, height: 1000 } },
  })),
  use: {
    ...base.use,
    baseURL: 'http://localhost:5184',
    viewport: { width: 1440, height: 1000 },
    video: { mode: 'on', size: { width: 1440, height: 1000 } },
  },
  webServer: {
    command: 'vp dev --port 5184 --strictPort',
    url: 'http://localhost:5184',
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
