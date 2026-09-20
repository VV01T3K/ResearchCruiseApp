// Temporary TREX trial. Run from the repository root with Node >= 22.18.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

process.env.TZ = 'America/Los_Angeles';
const { formatDate } = await import('../frontend/src/lib/dateUtils.ts');
const cases = [
  { input: '2026-07-20', expected: '20.07.2026' },
  { input: '2026-07-20T00:00:00Z', expected: '19.07.2026' },
].map((test) => ({ ...test, actual: formatDate(test.input, 'date') }));

console.log(JSON.stringify({
  runId: randomUUID(),
  executedAt: new Date().toISOString(),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  node: process.version,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  cases,
}, null, 2));

for (const { input, expected, actual } of cases) {
  assert.equal(actual, expected, `Calendar date/instant distinction for ${input}`);
}
console.log('PASS: date-only values preserve their calendar day; instants use local time.');
