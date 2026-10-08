// Direct measurement of the list endpoint (no browser).
//
//   node measure-api.mjs --variant old --n 1000 --runs 30
//   node measure-api.mjs --variant new --n 1000 --runs 30
//
// Cases
//   old: list_full                 GET /api/CruiseApplications (everything)
//   new: page_first / page_middle / page_last
//                                  default sort, first vs deep pages (keyset cursor);
//                                  "last" = last FULL page, so all three return PAGE_SIZE items
//        filtered_first / filtered_last
//                                  FILTER_QUERY (year + date sort), first vs last page
//        all_pages                 walk every page sequentially = cost of reading the whole list
//
// Per request: TTFB (response headers received), total time, raw body size,
// gzip size (zlib level 6 of the body - the backend does not compress, so this is
// what compression would give), bytes on the wire and Content-Encoding.

import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import zlib from 'node:zlib';

import { AuthSession } from './lib/auth.mjs';
import { PERF_DIR, appendCsv, describe, getCredentials, getVariant, intOpt, opt, variantOpt } from './lib/config.mjs';

const VARIANT = getVariant();
const N = opt('N', undefined);
if (!N) throw new Error('N is required (data-size label, e.g. 1000)');

const API_URL = opt('API_URL', 'http://localhost:3000').replace(/\/$/, '');
const LIST_PATH = variantOpt('API_LIST_PATH', VARIANT);
const PAGINATED = opt('PAGINATED', VARIANT === 'old' ? 'false' : 'true') === 'true';
const PAGE_SIZE = intOpt('PAGE_SIZE', 20);
const FILTER_QUERY = opt('FILTER_QUERY', 'year=2025&sortBy=date&descending=false');
const RUNS = intOpt('RUNS', 30);
const WARMUP = intOpt('WARMUP', 3);
const ALL_PAGES_RUNS = intOpt('ALL_PAGES_RUNS', Math.min(RUNS, 5));
const ACCEPT_ENCODING = opt('ACCEPT_ENCODING', 'gzip, deflate, br');
const RESULTS = path.resolve(PERF_DIR, opt('API_RESULTS', 'results/api-results.csv'));

const COLUMNS = [
  'variant', 'n', 'case', 'run', 'timestamp', 'status',
  'ttfb_ms', 'total_ms', 'bytes_raw', 'bytes_gzip', 'bytes_wire', 'content_encoding', 'items', 'requests',
];

const agent = new (API_URL.startsWith('https') ? https : http).Agent({ keepAlive: true, maxSockets: 1 });

/** One GET with timing. The body is decompressed if the server compressed it. */
function get(url, token) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const start = process.hrtime.bigint();
    const req = lib.get(
      url,
      { agent, headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Accept-Encoding': ACCEPT_ENCODING } },
      (res) => {
        const ttfb = Number(process.hrtime.bigint() - start) / 1e6;
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const total = Number(process.hrtime.bigint() - start) / 1e6;
          const wire = Buffer.concat(chunks);
          const encoding = res.headers['content-encoding'] ?? '';
          let raw = wire;
          if (encoding === 'gzip') raw = zlib.gunzipSync(wire);
          else if (encoding === 'br') raw = zlib.brotliDecompressSync(wire);
          else if (encoding === 'deflate') raw = zlib.inflateSync(wire);
          resolve({ status: res.statusCode, ttfb, total, wire: wire.length, raw, encoding });
        });
        res.on('error', reject);
      }
    );
    req.on('error', reject);
  });
}

function parse(raw) {
  const json = JSON.parse(raw.toString('utf8'));
  if (Array.isArray(json)) return { items: json.length, nextCursor: null };
  return { items: json.items?.length ?? 0, nextCursor: json.nextCursor ?? null };
}

const url = (query) => `${API_URL}${LIST_PATH}${query ? `?${query}` : ''}`;
const pageQuery = (base, cursor) =>
  [base, `pageSize=${PAGE_SIZE}`, cursor ? `cursor=${encodeURIComponent(cursor)}` : ''].filter(Boolean).join('&');

/**
 * Walks all pages once. Returns the cursors (index 0 = first page = no cursor) and
 * the index of the last FULL page: the final page is usually shorter, which would
 * make "deep page" look faster for a reason unrelated to its depth.
 */
async function collectCursors(auth, base) {
  const cursors = [null];
  let lastFull = 0;
  for (;;) {
    await auth.ensureFresh();
    const res = await get(url(pageQuery(base, cursors[cursors.length - 1])), auth.accessToken);
    if (res.status !== 200) throw new Error(`HTTP ${res.status} while collecting cursors`);
    const { items, nextCursor } = parse(res.raw);
    if (items === PAGE_SIZE) lastFull = cursors.length - 1;
    if (!nextCursor) return { cursors, lastFull };
    cursors.push(nextCursor);
  }
}

function toRow(caseName, run, res) {
  const { items } = res.status === 200 ? parse(res.raw) : { items: 0 };
  return {
    variant: VARIANT,
    n: N,
    case: caseName,
    run,
    timestamp: new Date().toISOString(),
    status: res.status,
    ttfb_ms: res.ttfb,
    total_ms: res.total,
    bytes_raw: res.raw.length,
    bytes_gzip: zlib.gzipSync(res.raw, { level: 6 }).length,
    bytes_wire: res.wire,
    content_encoding: res.encoding,
    items,
    requests: 1,
  };
}

async function main() {
  const auth = new AuthSession({
    mode: variantOpt('AUTH_MODE', VARIANT),
    apiUrl: API_URL,
    loginPath: variantOpt('LOGIN_PATH', VARIANT),
    credentials: getCredentials(),
  });
  await auth.login();

  /** case name -> function returning a URL */
  const cases = {};
  if (!PAGINATED) {
    cases.list_full = () => url('');
  } else {
    const defaultCursors = await collectCursors(auth, 'sortBy=number&descending=true');
    const filteredCursors = await collectCursors(auth, FILTER_QUERY);
    console.log(
      `pages: default=${defaultCursors.cursors.length} (last full #${defaultCursors.lastFull + 1}), ` +
        `filtered (${FILTER_QUERY})=${filteredCursors.cursors.length} (last full #${filteredCursors.lastFull + 1})`
    );
    const at = (cursors, i) => cursors[Math.max(0, Math.min(cursors.length - 1, i))];
    cases.page_first = () => url(pageQuery('sortBy=number&descending=true', null));
    cases.page_middle = () => url(pageQuery('sortBy=number&descending=true', at(defaultCursors.cursors, Math.floor(defaultCursors.lastFull / 2))));
    cases.page_last = () => url(pageQuery('sortBy=number&descending=true', at(defaultCursors.cursors, defaultCursors.lastFull)));
    cases.filtered_first = () => url(pageQuery(FILTER_QUERY, null));
    cases.filtered_last = () => url(pageQuery(FILTER_QUERY, at(filteredCursors.cursors, filteredCursors.lastFull)));
  }

  console.log(`variant=${VARIANT} n=${N} endpoint=${API_URL}${LIST_PATH} runs=${RUNS}+${WARMUP} warmup -> ${RESULTS}`);
  const collected = {};
  // Cases are interleaved inside each run so drift affects all of them equally.
  for (let run = 1; run <= WARMUP + RUNS; run++) {
    const rows = [];
    for (const [name, makeUrl] of Object.entries(cases)) {
      await auth.ensureFresh();
      const res = await get(makeUrl(), auth.accessToken);
      if (run > WARMUP) rows.push(toRow(name, run - WARMUP, res));
    }
    if (rows.length) {
      appendCsv(RESULTS, COLUMNS, rows);
      for (const r of rows) (collected[r.case] ??= []).push(r);
    }
  }

  if (PAGINATED && ALL_PAGES_RUNS > 0) {
    // Full scan through pagination, comparable with old's list_full.
    for (let run = 1; run <= ALL_PAGES_RUNS; run++) {
      let cursor = null;
      const agg = { ttfb: 0, total: 0, raw: 0, gzip: 0, wire: 0, items: 0, requests: 0, status: 200, encoding: '' };
      const start = process.hrtime.bigint();
      do {
        await auth.ensureFresh();
        const res = await get(url(pageQuery('sortBy=number&descending=true', cursor)), auth.accessToken);
        if (res.status !== 200) {
          agg.status = res.status;
          break;
        }
        const parsed = parse(res.raw);
        cursor = parsed.nextCursor;
        agg.ttfb += res.ttfb;
        agg.raw += res.raw.length;
        agg.gzip += zlib.gzipSync(res.raw, { level: 6 }).length;
        agg.wire += res.wire;
        agg.items += parsed.items;
        agg.requests++;
        agg.encoding = res.encoding;
      } while (cursor);
      const row = {
        variant: VARIANT,
        n: N,
        case: 'all_pages',
        run,
        timestamp: new Date().toISOString(),
        status: agg.status,
        ttfb_ms: agg.ttfb,
        total_ms: Number(process.hrtime.bigint() - start) / 1e6,
        bytes_raw: agg.raw,
        bytes_gzip: agg.gzip,
        bytes_wire: agg.wire,
        content_encoding: agg.encoding,
        items: agg.items,
        requests: agg.requests,
      };
      appendCsv(RESULTS, COLUMNS, [row]);
      (collected.all_pages ??= []).push(row);
    }
  }

  console.log('\ncase            median ttfb / total (p95 total)      raw KiB  gzip KiB  items  req  status');
  for (const [name, rows] of Object.entries(collected)) {
    const ttfb = describe(rows.map((r) => r.ttfb_ms));
    const total = describe(rows.map((r) => r.total_ms));
    const r0 = rows[0];
    const statuses = [...new Set(rows.map((r) => r.status))].join('/');
    console.log(
      `${name.padEnd(15)} ${ttfb.median.toFixed(1).padStart(8)} / ${total.median.toFixed(1).padStart(8)} ms (${total.p95.toFixed(1).padStart(8)})` +
        `  ${(r0.bytes_raw / 1024).toFixed(1).padStart(8)} ${(r0.bytes_gzip / 1024).toFixed(1).padStart(8)} ${String(r0.items).padStart(6)} ${String(r0.requests).padStart(4)}  ${statuses}`
    );
  }
  agent.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
