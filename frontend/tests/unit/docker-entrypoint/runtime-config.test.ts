import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it, onTestFinished } from 'vite-plus/test';

// Without request auth, Sentry routes an envelope to whatever project its body names.
it('the Sentry proxy authenticates as the configured DSN', () => {
  const dir = mkdtempSync(join(tmpdir(), 'runtime-config-'));
  onTestFinished(() => rmSync(dir, { recursive: true }));
  const script = readFileSync(new URL('../../../docker-entrypoint.d/90-runtime-config.sh', import.meta.url), 'utf8')
    .replaceAll('/etc/nginx/', `${dir}/`)
    .replaceAll('/app/', `${dir}/`);

  execFileSync('sh', ['-c', script], {
    env: { PATH: process.env.PATH, SENTRY_DSN: 'https://abc123:secret@sentry.example.org/42' },
  });

  const conf = readFileSync(join(dir, 'runtime.conf'), 'utf8');
  expect(conf).toContain('"https://sentry.example.org/api/42/envelope/"');
  expect(conf).toContain('proxy_set_header X-Sentry-Auth "Sentry sentry_key=abc123, sentry_version=7";');
});
