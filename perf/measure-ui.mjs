// Browser measurements of the cruise applications list (Playwright + Chromium).
// Works unchanged against the old (v2.5.1) and new (staging) application; the
// differences are expressed by parameters (see README.md / `--help`).
//
//   node measure-ui.mjs --variant new --n 1000 --runs 30 --network none --cpu 1

import { chromium } from 'playwright';
import path from 'node:path';

import { AuthSession } from './lib/auth.mjs';
import {
  PERF_DIR,
  appendCsv,
  describe,
  getCredentials,
  getVariant,
  intOpt,
  numOpt,
  opt,
  toMatcher,
  variantOpt,
} from './lib/config.mjs';

if (process.argv.includes('--help')) {
  console.log(`Options (env or --flag):
  VARIANT        old|new (required)          N              data-size label (required)
  BASE_URL       frontend origin [http://localhost:4173]
  PAGE_PATH      list page path [/applications]
  API_URL        backend origin [http://localhost:3000]
  ROW_SELECTOR   list row selector [table tbody tr:not([aria-hidden]):not([role="presentation"])]
  LIST_CONTAINER element whose DOM mutations mean "the list changed" [table tbody]
  API_MATCH      list endpoint: substring or /regex/ [per variant]
  RUNS [30]  WARMUP [3]  NETWORK none|fast4g|slow4g [none]  CPU throttling rate [1]
  SCENARIOS      comma list [initial_load,scroll_pages,scroll_all,filter_change,sort_change]
  SCROLL_TARGET_ROWS [60]  SCROLL_STEP_PX [500]  SCROLL_ALL_STEP_PX [2000]
  SCROLL_ALL_TIMEOUT_MS [300000]  LOAD_TIMEOUT_MS [180000]  QUIET_MS [500]  SETTLE_MS [1000]
  FILTER_COLUMN [Rok rejsu]  FILTER_OPTION [2025]  SORT_COLUMN [Data]
  SORT_OPTION [/^Sortuj (rosnąco|malejąco)$/]  VIEWPORT [1920x1080]  HEADED [false]
  RESULTS [results/results.csv]  PERF_EMAIL [admin@gmail.com]  PERF_PASSWORD | CREDENTIALS_FILE [../credentials.log]
  AUTH_MODE legacy|v2  LOGIN_PATH  (per variant)`);
  process.exit(0);
}

// ------------------------------------------------------------- parameters ---

const VARIANT = getVariant();
const N = opt('N', undefined);
if (!N) throw new Error('N is required (data-size label, e.g. 1000)');

const BASE_URL = opt('BASE_URL', 'http://localhost:4173').replace(/\/$/, '');
const PAGE_URL = BASE_URL + opt('PAGE_PATH', '/applications');
const API_URL = opt('API_URL', 'http://localhost:3000');
const ROW_SELECTOR = opt('ROW_SELECTOR', 'table tbody tr:not([aria-hidden]):not([role="presentation"])');
const LIST_CONTAINER = opt('LIST_CONTAINER', 'table tbody');
const isListRequest = toMatcher(variantOpt('API_MATCH', VARIANT));

const RUNS = intOpt('RUNS', 30);
const WARMUP = intOpt('WARMUP', 3);
const NETWORK = opt('NETWORK', 'none');
const CPU = numOpt('CPU', 1);
const SCENARIOS = opt('SCENARIOS', 'initial_load,scroll_pages,scroll_all,filter_change,sort_change')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const SCROLL_TARGET_ROWS = intOpt('SCROLL_TARGET_ROWS', 60);
const SCROLL_STEP_PX = intOpt('SCROLL_STEP_PX', 500);
const SCROLL_ALL_STEP_PX = intOpt('SCROLL_ALL_STEP_PX', 2000);
const SCROLL_ALL_TIMEOUT_MS = intOpt('SCROLL_ALL_TIMEOUT_MS', 300_000);
const LOAD_TIMEOUT_MS = intOpt('LOAD_TIMEOUT_MS', 180_000);
const QUIET_MS = intOpt('QUIET_MS', 500);
const SETTLE_MS = intOpt('SETTLE_MS', 1000);

const FILTER_COLUMN = opt('FILTER_COLUMN', 'Rok rejsu');
const FILTER_OPTION = opt('FILTER_OPTION', '2025');
const SORT_COLUMN = opt('SORT_COLUMN', 'Data');
const SORT_OPTION = opt('SORT_OPTION', '/^Sortuj (rosnąco|malejąco)$/');

const [VIEW_W, VIEW_H] = opt('VIEWPORT', '1920x1080').split('x').map(Number);
const RESULTS = path.resolve(PERF_DIR, opt('RESULTS', 'results/results.csv'));

// Chrome DevTools presets (throughput in bytes/s, latency in ms).
const NETWORK_PROFILES = {
  none: null,
  fast4g: { latency: 165, downloadThroughput: (9 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (1.5 * 1024 * 1024 * 0.9) / 8 },
  slow4g: { latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 },
};
if (!(NETWORK in NETWORK_PROFILES)) throw new Error(`NETWORK must be one of ${Object.keys(NETWORK_PROFILES)}`);

const COLUMNS = [
  'variant', 'n', 'network', 'cpu', 'scenario', 'run', 'timestamp', 'status', 'timed_out', 'note',
  'duration_ms', 'first_row_ms', 'list_ready_ms', 'fcp_ms', 'lcp_ms', 'tbt_ms', 'long_tasks',
  'js_heap_used_bytes', 'js_heap_used_after_gc_bytes', 'dom_nodes', 'dom_elements',
  'api_requests', 'api_transfer_bytes', 'api_body_bytes', 'api_items',
  'total_requests', 'total_transfer_bytes', 'rows_rendered', 'rows_reached',
];

// --------------------------------------------------- in-page instrumentation ---

// Runs before any application script. performance.now() is measured from the
// navigation start of the document, so every timestamp below is "ms since navigation".
function instrumentation({ rowSelector, containerSelector }) {
  const perf = (window.__perf = {
    firstRowTs: null,
    lastListMutationTs: 0,
    listMutations: 0,
    fcp: null,
    lcp: null,
    longTasks: [],
    actionTs: null,
  });

  const observe = (type, cb) => {
    try {
      new PerformanceObserver((list) => list.getEntries().forEach(cb)).observe({ type, buffered: true });
    } catch {
      /* entry type unsupported */
    }
  };
  observe('longtask', (e) => perf.longTasks.push([e.startTime, e.duration]));
  observe('largest-contentful-paint', (e) => (perf.lcp = e.renderTime || e.loadTime || e.startTime));
  observe('paint', (e) => e.name === 'first-contentful-paint' && (perf.fcp = e.startTime));

  const inList = (node) => {
    const el = node.nodeType === 1 ? node : node.parentElement;
    return !!el && (el.closest(containerSelector) !== null || el.querySelector?.(containerSelector) != null);
  };

  new MutationObserver((mutations) => {
    const now = performance.now();
    if (perf.firstRowTs === null && document.querySelector(rowSelector)) perf.firstRowTs = now;
    for (const m of mutations) {
      if (inList(m.target)) {
        perf.lastListMutationTs = now;
        perf.listMutations++;
        break;
      }
    }
  }).observe(document, { childList: true, subtree: true, characterData: true, attributes: false });
}

// ---------------------------------------------------------------- helpers ---

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Tracks requests of one page; list-endpoint responses are measured in detail. */
function trackNetwork(page) {
  // listComplete: false while the last list response announced a further page (nextCursor),
  // true once a response says there is none (or returned a plain array = whole list).
  const net = { inflight: 0, lastEvent: Date.now(), list: [], total: { requests: 0, transfer: 0 }, pending: [], listComplete: null };

  page.on('request', (req) => {
    if (isListRequest(req.url()) && req.method() === 'GET') {
      net.inflight++;
      net.lastEvent = Date.now();
    }
  });
  const done = async (req, ok) => {
    const isList = isListRequest(req.url()) && req.method() === 'GET';
    const work = (async () => {
      let transfer = 0;
      try {
        const sizes = await req.sizes();
        transfer = sizes.responseBodySize + sizes.responseHeadersSize;
      } catch {
        /* request without response */
      }
      net.total.requests++;
      net.total.transfer += transfer;
      if (!isList) return;
      let body = 0;
      let items = 0;
      if (ok) {
        try {
          const buf = await (await req.response()).body();
          body = buf.length;
          const json = JSON.parse(buf.toString('utf8'));
          items = Array.isArray(json) ? json.length : Array.isArray(json?.items) ? json.items.length : 0;
          net.listComplete = Array.isArray(json) || json?.nextCursor == null;
        } catch {
          /* non-JSON body */
        }
      }
      net.list.push({ transfer, body, items, ok });
    })();
    net.pending.push(work);
    await work;
    if (isList) {
      net.inflight--;
      net.lastEvent = Date.now();
    }
  };
  page.on('requestfinished', (req) => done(req, true));
  page.on('requestfailed', (req) => done(req, false));
  return net;
}

function snapshot(net) {
  return { list: net.list.length, requests: net.total.requests, transfer: net.total.transfer };
}

async function networkDelta(net, before) {
  await Promise.all(net.pending);
  const list = net.list.slice(before.list);
  return {
    api_requests: list.length,
    api_transfer_bytes: list.reduce((s, r) => s + r.transfer, 0),
    api_body_bytes: list.reduce((s, r) => s + r.body, 0),
    api_items: list.reduce((s, r) => s + r.items, 0),
    total_requests: net.total.requests - before.requests,
    total_transfer_bytes: net.total.transfer - before.transfer,
  };
}

/**
 * Waits until no list request is in flight, no list request finished for QUIET_MS
 * and the list DOM has not changed for QUIET_MS. Optionally requires a list DOM
 * change after `afterTs` (page time) first.
 */
async function waitForListIdle(page, net, { timeoutMs, afterTs = null }) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const state = await page.evaluate(() => ({ now: performance.now(), last: window.__perf.lastListMutationTs }));
    const domQuiet = state.now - state.last >= QUIET_MS;
    const changed = afterTs === null || state.last > afterTs;
    if (net.inflight === 0 && Date.now() - net.lastEvent >= QUIET_MS && domQuiet && changed) return true;
    await sleep(50);
  }
  return false;
}

async function cdpMetrics(cdp, page) {
  const read = async () =>
    Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const before = await read();
  await cdp.send('HeapProfiler.collectGarbage');
  const after = await read();
  return {
    js_heap_used_bytes: before.JSHeapUsedSize,
    js_heap_used_after_gc_bytes: after.JSHeapUsedSize,
    // Live DOM nodes after GC (detached nodes still referenced by the app are included).
    dom_nodes: after.Nodes,
    // Elements attached to the document.
    dom_elements: await page.evaluate(() => document.getElementsByTagName('*').length),
  };
}

/** Sum of (duration - 50 ms) of long tasks that started inside [from, to]. */
async function blockingTime(page, from, to) {
  return page.evaluate(
    ([from, to]) => {
      const tasks = window.__perf.longTasks.filter(([start]) => start >= from && start <= to);
      return { tbt: tasks.reduce((s, [, d]) => s + Math.max(0, d - 50), 0), count: tasks.length };
    },
    [from, to]
  );
}

const countRows = (page) => page.evaluate((sel) => document.querySelectorAll(sel).length, ROW_SELECTOR);

// --------------------------------------------------------------- browsing ---

async function openPage(browser, auth) {
  const context = await browser.newContext({ viewport: { width: VIEW_W, height: VIEW_H } });
  await auth.installInContext(context, BASE_URL);
  await context.addInitScript(instrumentation, { rowSelector: ROW_SELECTOR, containerSelector: LIST_CONTAINER });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Network.enable');
  const profile = NETWORK_PROFILES[NETWORK];
  if (profile) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...profile });
  if (CPU !== 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const net = trackNetwork(page);
  return { context, page, cdp, net };
}

/** Navigates to the list and waits until it is complete and idle. */
async function loadList(page, net) {
  await page.goto(PAGE_URL, { waitUntil: 'commit', timeout: LOAD_TIMEOUT_MS });
  await page.waitForFunction(() => window.__perf.firstRowTs !== null, null, { timeout: LOAD_TIMEOUT_MS, polling: 50 });
  if (!(await waitForListIdle(page, net, { timeoutMs: LOAD_TIMEOUT_MS }))) throw new Error('list did not become idle');
}

/**
 * Scrolls the window by `stepPx` per animation frame until `isDone` holds.
 * Row index = data-index (virtualized list) or position in the DOM (plain list).
 */
async function scrollLoop(page, net, { stepPx, timeoutMs, mode, targetIndex }) {
  const deadline = Date.now() + timeoutMs;
  let quietSince = null;
  let stalls = 0;
  let state;
  for (;;) {
    state = await page.evaluate(
      async ({ stepPx, sel, targetIndex }) => {
        const p = window.__perf;
        const y0 = window.scrollY;
        const h0 = document.documentElement.scrollHeight;
        window.scrollBy(0, stepPx);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const now = performance.now();
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (window.scrollY !== y0 || document.documentElement.scrollHeight !== h0) p.lastProgressTs = now;

        let reached = false;
        if (targetIndex !== null) {
          if (!p.target?.isConnected) {
            const first = document.querySelector(sel);
            p.target = first?.hasAttribute('data-index')
              ? document.querySelector(`${sel}[data-index="${targetIndex}"]`)
              : document.querySelectorAll(sel)[targetIndex];
          }
          reached = !!p.target?.isConnected && p.target.getBoundingClientRect().bottom <= window.innerHeight;
          if (reached && p.reachedTs == null) p.reachedTs = now;
        }
        return { now, atBottom, reached, lastProgressTs: p.lastProgressTs ?? now };
      },
      { stepPx, sel: ROW_SELECTOR, targetIndex }
    );

    if (mode === 'target' && state.reached) return { timedOut: false, endTs: state.now, stalls };
    // At the bottom with nothing loading for 2×QUIET_MS: either the end of the list, or
    // infinite scroll stopped requesting pages. Only the API response can tell which.
    if (state.atBottom && net.inflight === 0 && Date.now() - net.lastEvent >= QUIET_MS) {
      quietSince ??= Date.now();
      if (Date.now() - quietSince >= QUIET_MS) {
        // Only a list response that announced no further page counts as "whole list loaded";
        // no response at all (null) is not proof of anything.
        if (net.listComplete === true) {
          // Whole list loaded. In target mode the target row does not exist (list shorter than the target).
          return { timedOut: false, endTs: state.lastProgressTs, stalls, shortList: mode === 'target' };
        }
        if (net.listComplete === false) {
          // Stalled: scroll one screen up so the next steps move the sentinel into view
          // again, as a user would. Counted and reported in the note column.
          stalls++;
          quietSince = null;
          await page.evaluate(() => window.scrollBy(0, -window.innerHeight));
        }
      }
    } else {
      quietSince = null;
    }
    if (Date.now() > deadline) return { timedOut: true, endTs: state.now, stalls };
  }
}

/** Highest row index whose bottom edge has been scrolled into the viewport, +1. */
async function rowsReached(page) {
  return page.evaluate((sel) => {
    const rows = document.querySelectorAll(sel);
    if (!rows.length) return 0;
    const visible = (el) => el.getBoundingClientRect().bottom <= window.innerHeight;
    if (rows[0].hasAttribute('data-index')) {
      let max = -1;
      rows.forEach((r) => visible(r) && (max = Math.max(max, Number(r.getAttribute('data-index')))));
      return max + 1;
    }
    let lo = 0;
    let hi = rows.length - 1;
    let best = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (visible(rows[mid])) {
        best = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return best + 1;
  }, ROW_SELECTOR);
}

/** Opens a column's header popover and returns the matching menu item (or null). */
async function findMenuItem(page, column, optionSpec) {
  const header = page.locator('th button', { hasText: column }).first();
  try {
    await header.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return { item: null, reason: `column header "${column}" has no filter/sort menu` };
  }
  await header.click();
  const m = /^\/(.*)\/([a-z]*)$/s.exec(optionSpec);
  const text = m ? new RegExp(m[1], m[2]) : new RegExp(`^\\s*${optionSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
  const item = page.locator('[role="menuitem"]:not([disabled])').filter({ hasText: text }).first();
  try {
    await item.waitFor({ state: 'visible', timeout: 5000 });
    // Items are disabled while the popover animates open.
    await page.waitForFunction((el) => !el.disabled, await item.elementHandle(), { timeout: 5000 });
  } catch {
    return { item: null, reason: `no enabled menu item matching ${text} under "${column}"` };
  }
  return { item };
}

// -------------------------------------------------------------- scenarios ---

async function scenarioInitialLoad({ page, cdp, net }) {
  const before = snapshot(net);
  await page.goto(PAGE_URL, { waitUntil: 'commit', timeout: LOAD_TIMEOUT_MS });
  await page.waitForFunction(() => window.__perf.firstRowTs !== null, null, { timeout: LOAD_TIMEOUT_MS, polling: 50 });
  const idle = await waitForListIdle(page, net, { timeoutMs: LOAD_TIMEOUT_MS });
  await sleep(SETTLE_MS); // let late long tasks and LCP entries arrive
  const p = await page.evaluate(() => {
    const { firstRowTs, lastListMutationTs, fcp, lcp } = window.__perf;
    return { firstRowTs, lastListMutationTs, fcp, lcp, now: performance.now() };
  });
  const { tbt, count } = await blockingTime(page, 0, p.now);
  return {
    timed_out: idle ? 0 : 1,
    duration_ms: p.lastListMutationTs,
    first_row_ms: p.firstRowTs,
    list_ready_ms: p.lastListMutationTs,
    fcp_ms: p.fcp,
    lcp_ms: p.lcp,
    tbt_ms: tbt,
    long_tasks: count,
    ...(await cdpMetrics(cdp, page)),
    ...(await networkDelta(net, before)),
    rows_rendered: await countRows(page),
  };
}

async function scenarioScroll({ page, cdp, net }, toBottom) {
  await loadList(page, net);
  const before = snapshot(net);
  const t0 = await page.evaluate(() => performance.now());
  const n = Number(N);
  const targetIndex = toBottom ? null : Math.min(SCROLL_TARGET_ROWS, Number.isFinite(n) ? n : SCROLL_TARGET_ROWS) - 1;
  const result = await scrollLoop(page, net, {
    stepPx: toBottom ? SCROLL_ALL_STEP_PX : SCROLL_STEP_PX,
    timeoutMs: toBottom ? SCROLL_ALL_TIMEOUT_MS : LOAD_TIMEOUT_MS,
    mode: toBottom ? 'bottom' : 'target',
    targetIndex,
  });
  await waitForListIdle(page, net, { timeoutMs: 30_000 }); // finish in-flight responses for byte counts
  const { tbt, count } = await blockingTime(page, t0, result.endTs);
  return {
    timed_out: result.timedOut ? 1 : 0,
    note: [
      result.timedOut ? `timeout after ${toBottom ? SCROLL_ALL_TIMEOUT_MS : LOAD_TIMEOUT_MS} ms` : '',
      // Infinite scroll stopped loading at the bottom and needed a scroll up/down to continue.
      result.stalls ? `stalls=${result.stalls}` : '',
      result.shortList ? 'list shorter than SCROLL_TARGET_ROWS, scrolled to its end' : '',
    ]
      .filter(Boolean)
      .join('; '),
    duration_ms: result.endTs - t0,
    tbt_ms: tbt,
    long_tasks: count,
    ...(await cdpMetrics(cdp, page)),
    ...(await networkDelta(net, before)),
    rows_rendered: await countRows(page),
    rows_reached: await rowsReached(page),
  };
}

async function scenarioMenuAction({ page, cdp, net }, column, option) {
  await loadList(page, net);
  const { item, reason } = await findMenuItem(page, column, option);
  if (!item) return { status: 'skipped', note: reason };
  const rowsBefore = await countRows(page);
  const before = snapshot(net);
  // Timestamp and click in the same task, so the measured interval starts exactly at the action.
  const t0 = await item.evaluate((el) => {
    window.__perf.actionTs = performance.now();
    el.click();
    return window.__perf.actionTs;
  });
  const idle = await waitForListIdle(page, net, { timeoutMs: LOAD_TIMEOUT_MS, afterTs: t0 });
  const p = await page.evaluate(() => ({ lastListMutationTs: window.__perf.lastListMutationTs }));
  const { tbt, count } = await blockingTime(page, t0, p.lastListMutationTs);
  const rowsAfter = await countRows(page);
  return {
    timed_out: idle ? 0 : 1,
    note: idle ? `rows ${rowsBefore}->${rowsAfter}` : 'list did not change/settle',
    duration_ms: p.lastListMutationTs - t0,
    tbt_ms: tbt,
    long_tasks: count,
    ...(await cdpMetrics(cdp, page)),
    ...(await networkDelta(net, before)),
    rows_rendered: rowsAfter,
  };
}

const SCENARIO_FNS = {
  initial_load: (ctx) => scenarioInitialLoad(ctx),
  scroll_pages: (ctx) => scenarioScroll(ctx, false),
  scroll_all: (ctx) => scenarioScroll(ctx, true),
  filter_change: (ctx) => scenarioMenuAction(ctx, FILTER_COLUMN, FILTER_OPTION),
  sort_change: (ctx) => scenarioMenuAction(ctx, SORT_COLUMN, SORT_OPTION),
};

// ------------------------------------------------------------------- main ---

async function main() {
  for (const s of SCENARIOS) if (!SCENARIO_FNS[s]) throw new Error(`Unknown scenario "${s}"`);

  const auth = new AuthSession({
    mode: variantOpt('AUTH_MODE', VARIANT),
    apiUrl: API_URL,
    loginPath: variantOpt('LOGIN_PATH', VARIANT),
    credentials: getCredentials(),
  });
  await auth.login();

  console.log(
    `variant=${VARIANT} n=${N} network=${NETWORK} cpu=${CPU} runs=${RUNS}+${WARMUP} warmup scenarios=${SCENARIOS.join(',')}\n` +
      `page=${PAGE_URL} results=${RESULTS}`
  );

  const browser = await chromium.launch({ headless: opt('HEADED', 'false') !== 'true' });
  const collected = Object.fromEntries(SCENARIOS.map((s) => [s, []]));
  try {
    // Runs are the outer loop, so slow drift (thermal, background load) spreads over all scenarios.
    for (let run = 1; run <= WARMUP + RUNS; run++) {
      const warmup = run <= WARMUP;
      for (const scenario of SCENARIOS) {
        const ctx = await openPage(browser, auth);
        let metrics;
        try {
          metrics = { status: 'ok', ...(await SCENARIO_FNS[scenario](ctx)) };
        } catch (error) {
          metrics = { status: 'error', note: String(error.message ?? error).split('\n')[0].slice(0, 300) };
        } finally {
          await ctx.context.close();
        }
        if (metrics.status === 'ok' && metrics.timed_out) metrics.status = 'timeout';

        const label = warmup ? `warmup ${run}/${WARMUP}` : `run ${run - WARMUP}/${RUNS}`;
        console.log(
          `[${label}] ${scenario.padEnd(13)} ${metrics.status.padEnd(7)} ` +
            `duration=${fmt(metrics.duration_ms)} first_row=${fmt(metrics.first_row_ms)} tbt=${fmt(metrics.tbt_ms)} ` +
            `api=${metrics.api_requests ?? '-'}req/${fmt((metrics.api_transfer_bytes ?? NaN) / 1024)}KiB ` +
            `rows=${metrics.rows_rendered ?? '-'} ${metrics.note ?? ''}`
        );
        if (warmup) continue;

        const row = {
          variant: VARIANT,
          n: N,
          network: NETWORK,
          cpu: CPU,
          scenario,
          run: run - WARMUP,
          timestamp: new Date().toISOString(),
          timed_out: 0,
          ...metrics,
        };
        appendCsv(RESULTS, COLUMNS, [row]);
        collected[scenario].push(row);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\nSummary (median / p95):');
  for (const [scenario, rows] of Object.entries(collected)) {
    const ok = rows.filter((r) => r.status === 'ok');
    const key = scenario === 'initial_load' ? 'first_row_ms' : 'duration_ms';
    const d = describe(ok.map((r) => r[key]));
    const statuses = [...new Set(rows.map((r) => r.status))].join('/');
    console.log(`  ${scenario.padEnd(13)} ${key}=${fmt(d.median)} / ${fmt(d.p95)}  (${ok.length}/${rows.length} ok; ${statuses})`);
  }
}

function fmt(x) {
  return Number.isFinite(x) ? x.toFixed(0) : '-';
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
