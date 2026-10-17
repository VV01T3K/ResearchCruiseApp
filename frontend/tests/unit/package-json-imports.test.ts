import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vite-plus/test';

// Also catches `import()` and `require()`, which the lint rule misses.
it('the app source references package.json in no module specifier', () => {
  const src = new URL('../../src/', import.meta.url);
  const specifier = /['"`](?:[^'"`\n]*\/)?package\.json(?:\?[^'"`\n]*)?['"`]/;
  const offenders = readdirSync(src, { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.[cm]?[jt]sx?$/.test(path))
    .filter((path) => specifier.test(readFileSync(new URL(path, src), 'utf8')));

  expect(offenders).toEqual([]);
});
