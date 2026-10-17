import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vite-plus/test';

// `no-restricted-imports` in vite.tool.config.ts misses `import()` and `require()`, and oxlint has no
// `no-restricted-syntax`, so this catches any package.json module specifier left in the app source.
// Bundling package.json ships every dependency and script to browsers; `@/config` has the version.
it('the app source references package.json in no module specifier', () => {
  const src = new URL('../../src/', import.meta.url);
  const specifier = /['"`](?:[^'"`\n]*\/)?package\.json(?:\?[^'"`\n]*)?['"`]/;
  const offenders = readdirSync(src, { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.[cm]?[jt]sx?$/.test(path))
    .filter((path) => specifier.test(readFileSync(new URL(path, src), 'utf8')));

  expect(offenders).toEqual([]);
});
