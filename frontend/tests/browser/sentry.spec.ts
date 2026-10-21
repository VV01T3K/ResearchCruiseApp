import { test, expect } from './fixtures';

test('reset tokens in the page URL never reach Sentry', async ({ page }) => {
  await page.route('/runtime-config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.__SENTRY_DSN__ = 'https://key@sentry.invalid/1';
        window.__SENTRY_PROXY__ = '/monitoring';
        window.__SENTRY_TRACES_SAMPLE_RATE__ = '1';`,
    })
  );
  const envelopes: string[] = [];
  await page.route('/monitoring', (route) => {
    envelopes.push(route.request().postData() ?? '');
    return route.fulfill({ status: 200 });
  });

  await page.goto('/reset-password?emailBase64=YUBi&resetCode=SECRET');

  await expect.poll(() => envelopes.join('\n')).toContain('"type":"span"');
  expect(envelopes.join('\n')).toContain('resetCode=[Filtered]');
  expect(envelopes.join('\n')).not.toContain('SECRET');
});
