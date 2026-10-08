// Aggregates the raw CSVs and draws charts.
//
//   node aggregate.mjs                      results/results.csv (+ results/api-results.csv if present)
//   node aggregate.mjs --log-y true         logarithmic Y axis
//   node aggregate.mjs --individual true    also one figure per metric
//
// Outputs (in OUT_DIR, default results/):
//   summary.csv       one row per (variant, n, network, cpu, scenario, metric): count, median, p95, std, mean, min, max
//   api-summary.csv   one row per (variant, n, case, metric)
//   charts/overview-<network>-cpu<cpu>.png|svg   all key UI metrics vs N, old vs new, one figure per configuration
//   charts/api-overview.png|svg                  endpoint timings and sizes vs N
//
// Statistics use only rows with status=ok; status counts (ok/timeout/error/skipped)
// are reported in summary.csv so excluded runs stay visible.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

import { PERF_DIR, appendCsv, describe, opt, readCsv } from './lib/config.mjs';

const RESULTS = path.resolve(PERF_DIR, opt('RESULTS', 'results/results.csv'));
const API_RESULTS = path.resolve(PERF_DIR, opt('API_RESULTS', 'results/api-results.csv'));
const OUT_DIR = path.resolve(PERF_DIR, opt('OUT_DIR', 'results'));
const LOG_Y = opt('LOG_Y', 'false') === 'true';

const UI_KEYS = ['variant', 'n', 'network', 'cpu', 'scenario'];
const UI_METRICS = [
  'duration_ms', 'first_row_ms', 'list_ready_ms', 'fcp_ms', 'lcp_ms', 'tbt_ms', 'long_tasks',
  'js_heap_used_bytes', 'js_heap_used_after_gc_bytes', 'dom_nodes', 'dom_elements',
  'api_requests', 'api_transfer_bytes', 'api_body_bytes', 'api_items',
  'total_requests', 'total_transfer_bytes', 'rows_rendered', 'rows_reached',
];
const API_KEYS = ['variant', 'n', 'case'];
const API_METRICS = ['ttfb_ms', 'total_ms', 'bytes_raw', 'bytes_gzip', 'bytes_wire', 'items', 'requests'];

const SUMMARY_STATS = ['count', 'median', 'p95', 'std', 'mean', 'min', 'max'];

// --------------------------------------------------------------- summaries ---

function groupBy(rows, keys) {
  const groups = new Map();
  for (const row of rows) {
    const id = keys.map((k) => row[k]).join('\u0000');
    if (!groups.has(id)) groups.set(id, { key: Object.fromEntries(keys.map((k) => [k, row[k]])), rows: [] });
    groups.get(id).rows.push(row);
  }
  return [...groups.values()];
}

function summarize(rows, keys, metrics, isOk, extra = () => ({})) {
  const out = [];
  for (const { key, rows: groupRows } of groupBy(rows, keys)) {
    const ok = groupRows.filter(isOk);
    for (const metric of metrics) {
      const values = ok.map((r) => (r[metric] === '' ? NaN : Number(r[metric])));
      const stats = describe(values);
      if (stats.count === 0) continue;
      out.push({ ...key, metric, ...extra(groupRows), ...stats });
    }
  }
  const numericN = (r) => Number(r.n);
  return out.sort((a, b) =>
    keys.map((k) => (k === 'n' ? numericN(a) - numericN(b) : String(a[k]).localeCompare(String(b[k])))).find((d) => d !== 0) ?? 0
  );
}

/**
 * scroll_all is only valid if it reached the end of the list. A run that reached fewer
 * rows than the other runs of its group stopped early (e.g. infinite scroll stalled and
 * an older measure-ui.mjs took that for the end); it is counted as "incomplete" and left
 * out of the statistics. The raw CSV is not modified.
 */
function markIncompleteScrolls(rows) {
  const groups = groupBy(
    rows.filter((r) => r.scenario === 'scroll_all' && r.status === 'ok'),
    ['variant', 'n', 'network', 'cpu']
  );
  for (const { rows: groupRows } of groups) {
    const max = Math.max(...groupRows.map((r) => Number(r.rows_reached) || 0));
    for (const r of groupRows) {
      if ((Number(r.rows_reached) || 0) < max) r.status = 'incomplete';
    }
  }
  // A successful scenario always ends with rows on screen; "ok" with none means the
  // list never rendered (e.g. old v2.5.1 stuck on its loader) and an older script missed it.
  for (const r of rows) {
    if (r.status === 'ok' && r.rows_rendered !== '' && Number(r.rows_rendered) === 0) r.status = 'incomplete';
  }
  const incomplete = rows.filter((r) => r.status === 'incomplete');
  for (const r of incomplete) {
    console.log(`incomplete: ${r.variant} n=${r.n} ${r.network} cpu=${r.cpu} ${r.scenario} run ${r.run} (rows_reached=${r.rows_reached}, rows_rendered=${r.rows_rendered})`);
  }
  return rows;
}

/** Raw measurement files are inputs only; no output may ever point at them. */
function assertNotRawInput(file) {
  const target = path.resolve(file);
  if (target === RESULTS || target === API_RESULTS) {
    throw new Error(`Refusing to write ${target}: it is a raw results file. Use a different OUT_DIR.`);
  }
}

function writeCsv(file, columns, rows) {
  assertNotRawInput(file);
  if (fs.existsSync(file)) fs.rmSync(file); // summaries are regenerated, not accumulated
  appendCsv(file, columns, rows);
  console.log(`wrote ${path.relative(PERF_DIR, file)} (${rows.length} rows)`);
}


// ------------------------------------------------------------------ charts ---
//
// One overview figure per configuration instead of one file per metric:
//   charts/overview-<network>-cpu<cpu>.png|svg   3×3 panels, old vs new
//   charts/api-overview.png|svg                  2×2 panels, endpoint cases
// Each panel plots the median vs N (log X) with a whisker up to p95. With fewer
// than MIN_LINE_POINTS distinct N a trend line says nothing, so the panel shows
// grouped bars (one group per N) instead. --individual true additionally writes
// every panel as its own figure (handy for single figures in the thesis).

const INDIVIDUAL = opt('INDIVIDUAL', 'false') === 'true';
const MIN_LINE_POINTS = 3;

// Validated categorical slots (light surface). Every series also has its own dash
// pattern and marker, so the figures stay readable in grayscale print.
const SERIES_STYLE = {
  old: { color: '#eb6834', dash: '6 4', marker: 'square', label: 'old (v2.5.1, cała lista)' },
  new: { color: '#2a78d6', dash: '', marker: 'circle', label: 'new (paginacja)' },
  'old:list_full': { color: '#eb6834', dash: '6 4', marker: 'square', label: 'old: cała lista' },
  'new:page_first': { color: '#2a78d6', dash: '', marker: 'circle', label: 'new: 1. strona' },
  'new:page_last': { color: '#1baf7a', dash: '2 3', marker: 'diamond', label: 'new: ostatnia pełna strona' },
  'new:all_pages': { color: '#e87ba4', dash: '8 3 2 3', marker: 'triangle', label: 'new: wszystkie strony' },
};
const API_CHART_CASES = opt('API_CHART_CASES', 'old:list_full,new:page_first,new:page_last,new:all_pages').split(',');
const FALLBACK_STYLE = { color: '#5f5e5a', dash: '1 3', marker: 'circle' };
const styleOf = (name) => SERIES_STYLE[name] ?? { ...FALLBACK_STYLE, label: name };

const UI_PANELS = [
  { scenario: 'initial_load', metric: 'first_row_ms', title: 'Wejście: pierwszy wiersz', kind: 'time' },
  { scenario: 'initial_load', metric: 'tbt_ms', title: 'Wejście: Total Blocking Time', kind: 'time' },
  { scenario: 'initial_load', metric: 'js_heap_used_bytes', title: 'Wejście: sterta JS', kind: 'bytes' },
  { scenario: 'initial_load', metric: 'dom_nodes', title: 'Wejście: węzły DOM', kind: 'count', noun: 'węzłów' },
  { scenario: 'initial_load', metric: 'api_transfer_bytes', title: 'Wejście: transfer API', kind: 'bytes' },
  { scenario: 'scroll_all', metric: 'duration_ms', title: 'Przewinięcie do końca listy', kind: 'time' },
  { scenario: 'scroll_all', metric: 'api_transfer_bytes', title: 'Do końca listy: transfer API', kind: 'bytes' },
  { scenario: 'filter_change', metric: 'duration_ms', title: 'Zmiana filtra', kind: 'time' },
  { scenario: 'sort_change', metric: 'duration_ms', title: 'Zmiana sortowania', kind: 'time' },
];

const API_PANELS = [
  { metric: 'total_ms', title: 'Czas całkowity', kind: 'time' },
  { metric: 'ttfb_ms', title: 'Czas do pierwszego bajtu', kind: 'time' },
  { metric: 'bytes_raw', title: 'Rozmiar odpowiedzi', kind: 'bytes' },
  { metric: 'bytes_gzip', title: 'Rozmiar po gzip (wyliczony)', kind: 'bytes' },
];

const INK = { primary: '#1f1f1e', secondary: '#5f5e5a', grid: '#e4e3de', axis: '#a8a79f', surface: '#fcfcfb' };
const FONT = 'Segoe UI, Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function niceTicks(max, count = 4) {
  if (!(max > 0)) return [0, 1];
  const step0 = max / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0);
  const ticks = [];
  // Last tick is the first round value at or above max, so the axis always covers the data.
  for (let v = 0; ; v += step) {
    ticks.push(Number(v.toPrecision(12)));
    if (v >= max - step * 1e-9) break;
  }
  return ticks;
}

function fmtNum(v) {
  const a = Math.abs(v);
  if (a >= 1e6) return `${(v / 1e6).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mln`;
  if (a >= 1e4) return `${(v / 1e3).toLocaleString('pl-PL', { maximumFractionDigits: 0 })} tys.`;
  if (a >= 100) return v.toLocaleString('pl-PL', { maximumFractionDigits: 0 });
  if (a >= 10) return v.toLocaleString('pl-PL', { maximumFractionDigits: 1 });
  return v.toLocaleString('pl-PL', { maximumFractionDigits: 2 });
}

/** Axis label with exactly as many decimals as the tick step needs (no duplicate labels). */
function fmtTick(v, ticks) {
  if (ticks.length < 2 || v === 0) return fmtNum(v);
  const step = Math.abs(ticks[1] - ticks[0]);
  if (step >= 1) return fmtNum(v);
  const decimals = Math.min(6, Math.ceil(-Math.log10(step) - 1e-9) + (String(step).includes('5') ? 1 : 0));
  return v.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function marker(shape, x, y, r) {
  switch (shape) {
    case 'square':
      return `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="1"/>`;
    case 'diamond':
      return `<path d="M${x} ${y - r * 1.3}L${x + r * 1.3} ${y}L${x} ${y + r * 1.3}L${x - r * 1.3} ${y}Z"/>`;
    case 'triangle':
      return `<path d="M${x} ${y - r * 1.3}L${x + r * 1.2} ${y + r}L${x - r * 1.2} ${y + r}Z"/>`;
    default:
      return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
  }
}

/** Bar with 4px rounded top, flat on the baseline. */
function barPath(x, yTop, w, yBase) {
  const r = Math.min(4, w / 2, Math.max(0, yBase - yTop));
  return `M${x} ${yBase}V${yTop + r}Q${x} ${yTop} ${x + r} ${yTop}H${x + w - r}Q${x + w} ${yTop} ${x + w} ${yTop + r}V${yBase}Z`;
}

/**
 * One panel at (x0, y0) of size w×h.
 * series: [{ name, points: [{ n, median, p95 }] }] in legend order.
 */
function panelSvg({ x0, y0, w, h, title, unit, series, logY }) {
  const m = { top: 30, right: 14, bottom: 38, left: 52 };
  const pw = w - m.left - m.right;
  const ph = h - m.top - m.bottom;
  const left = x0 + m.left;
  const top = y0 + m.top;
  const base = top + ph;
  const out = [];

  out.push(`<text x="${x0 + m.left}" y="${y0 + 16}" font-size="14" font-weight="600" fill="${INK.primary}">${esc(title)}</text>`);
  out.push(`<text x="${x0 + w - m.right}" y="${y0 + 16}" font-size="11" fill="${INK.secondary}" text-anchor="end">${esc(unit)}${logY ? ', skala log.' : ''}</text>`);

  const ns = [...new Set(series.flatMap((s) => s.points.map((p) => p.n)))].sort((a, b) => a - b);
  const values = series.flatMap((s) => s.points.flatMap((p) => [p.median, p.p95])).filter(Number.isFinite);
  if (!ns.length || !values.length) {
    out.push(`<rect x="${left}" y="${top}" width="${pw}" height="${ph}" fill="none" stroke="${INK.grid}"/>`);
    out.push(`<text x="${left + pw / 2}" y="${top + ph / 2}" font-size="12" fill="${INK.secondary}" text-anchor="middle">brak danych</text>`);
    return out.join('');
  }

  // Y scale
  let y;
  let ticks;
  if (logY) {
    const positive = values.filter((v) => v > 0);
    const lo = Math.floor(Math.log10(Math.min(...positive)));
    let hi = Math.ceil(Math.log10(Math.max(...positive)));
    if (hi === lo) hi++;
    y = (v) => base - ((Math.log10(Math.max(v, 10 ** lo)) - lo) / (hi - lo)) * ph;
    ticks = Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i));
  } else {
    ticks = niceTicks(Math.max(...values));
    const yMax = ticks[ticks.length - 1];
    y = (v) => base - (v / yMax) * ph;
  }
  for (const t of ticks) {
    out.push(`<line x1="${left}" x2="${left + pw}" y1="${y(t)}" y2="${y(t)}" stroke="${INK.grid}"/>`);
    out.push(`<text x="${left - 6}" y="${y(t) + 4}" font-size="11" fill="${INK.secondary}" text-anchor="end">${esc(fmtTick(t, ticks))}</text>`);
  }
  out.push(`<line x1="${left}" x2="${left + pw}" y1="${base}" y2="${base}" stroke="${INK.axis}"/>`);

  const whisker = (cx, p, color) => {
    if (!(Number.isFinite(p.p95) && p.p95 > p.median)) return '';
    return (
      `<line x1="${cx}" x2="${cx}" y1="${y(p.median)}" y2="${y(p.p95)}" stroke="${color}" stroke-width="1.5" opacity="0.75"/>` +
      `<line x1="${cx - 4}" x2="${cx + 4}" y1="${y(p.p95)}" y2="${y(p.p95)}" stroke="${color}" stroke-width="1.5" opacity="0.75"/>`
    );
  };

  if (ns.length >= MIN_LINE_POINTS) {
    // Trend: log X, one tick per measured N.
    const lx0 = Math.log10(ns[0]);
    const lx1 = Math.log10(ns[ns.length - 1]);
    const pad = (lx1 - lx0) * 0.05;
    const x = (n) => left + ((Math.log10(n) - lx0 + pad) / (lx1 - lx0 + 2 * pad)) * pw;
    for (const n of ns) {
      out.push(`<text x="${x(n)}" y="${base + 16}" font-size="11" fill="${INK.secondary}" text-anchor="middle">${esc(fmtNum(n))}</text>`);
    }
    for (const s of series) {
      const st = styleOf(s.name);
      const pts = s.points.filter((p) => Number.isFinite(p.median)).sort((a, b) => a.n - b.n);
      if (!pts.length) continue;
      for (const p of pts) out.push(whisker(x(p.n), p, st.color));
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.n).toFixed(1)} ${y(p.median).toFixed(1)}`).join('');
      out.push(`<path d="${d}" fill="none" stroke="${st.color}" stroke-width="2" stroke-dasharray="${st.dash}" stroke-linejoin="round"/>`);
      out.push(`<g fill="${st.color}" stroke="${INK.surface}" stroke-width="2">${pts.map((p) => marker(st.marker, x(p.n), y(p.median), 4.5)).join('')}</g>`);
    }
  } else {
    // Too few N for a trend: grouped bars, one group per N, value on each bar.
    const groupW = pw / ns.length;
    const barW = Math.min(46, (groupW * 0.7) / series.length);
    const gap = 2;
    ns.forEach((n, gi) => {
      const groupCenter = left + groupW * (gi + 0.5);
      out.push(`<text x="${groupCenter}" y="${base + 16}" font-size="11" fill="${INK.secondary}" text-anchor="middle">N = ${esc(fmtNum(n))}</text>`);
      const totalW = series.length * barW + (series.length - 1) * gap;
      series.forEach((s, si) => {
        const st = styleOf(s.name);
        const p = s.points.find((q) => q.n === n);
        if (!p || !Number.isFinite(p.median)) return;
        const bx = groupCenter - totalW / 2 + si * (barW + gap);
        const yTop = Math.min(y(p.median), base - 1);
        out.push(`<path d="${barPath(bx, yTop, barW, base)}" fill="${st.color}"/>`);
        out.push(whisker(bx + barW / 2, p, INK.secondary));
        const labelY = Math.min(yTop, Number.isFinite(p.p95) ? y(p.p95) : yTop) - 5;
        out.push(`<text x="${bx + barW / 2}" y="${labelY}" font-size="11" fill="${INK.primary}" text-anchor="middle">${esc(fmtNum(p.median))}</text>`);
      });
    });
  }
  out.push(`<text x="${left + pw / 2}" y="${base + 32}" font-size="11" fill="${INK.secondary}" text-anchor="middle">${ns.length >= MIN_LINE_POINTS ? 'N (skala log.)' : ''}</text>`);
  return out.join('');
}

/** Figure = title, shared legend and a grid of panels. */
function figureSvg({ title, subtitle, panels, seriesNames, cols, logY }) {
  const panelW = 420;
  const panelH = 250;
  const W = cols * panelW + 24;

  // Legend items flow left to right and wrap onto a new line when the figure is too narrow.
  const items = [
    ...seriesNames.map((name) => ({ name, st: styleOf(name), width: 36 + styleOf(name).label.length * 7.2 + 24 })),
    { note: 'punkt/słupek: mediana · wąs: p95', width: 230 },
  ];
  const legend = [];
  let lx = 24;
  let ly = 74;
  for (const item of items) {
    if (lx > 24 && lx + item.width > W - 12) {
      lx = 24;
      ly += 24;
    }
    legend.push({ ...item, x: lx, y: ly });
    lx += item.width;
  }
  const headerH = ly + 18;
  const rows = Math.ceil(panels.length / cols);
  const H = headerH + rows * panelH + 12;

  const out = [`<rect width="${W}" height="${H}" fill="${INK.surface}"/>`];
  out.push(`<text x="24" y="32" font-size="19" font-weight="600" fill="${INK.primary}">${esc(title)}</text>`);
  out.push(`<text x="24" y="54" font-size="13" fill="${INK.secondary}">${esc(subtitle)}</text>`);
  for (const item of legend) {
    if (item.note) {
      out.push(`<text x="${item.x}" y="${item.y + 4}" font-size="12" fill="${INK.secondary}">${esc(item.note)}</text>`);
      continue;
    }
    const { st, x, y } = item;
    out.push(`<line x1="${x}" x2="${x + 28}" y1="${y}" y2="${y}" stroke="${st.color}" stroke-width="2" stroke-dasharray="${st.dash}"/>`);
    out.push(`<g fill="${st.color}" stroke="${INK.surface}" stroke-width="2">${marker(st.marker, x + 14, y, 4.5)}</g>`);
    out.push(`<text x="${x + 36}" y="${y + 4}" font-size="13" fill="${INK.primary}">${esc(st.label)}</text>`);
  }

  panels.forEach((panel, i) => {
    out.push(panelSvg({ x0: 12 + (i % cols) * panelW, y0: headerH + Math.floor(i / cols) * panelH, w: panelW, h: panelH, logY, ...panel }));
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">${out.join('')}</svg>`;
}

// ------------------------------------------------------------- key table ---
//
// key-metrics.csv / key-metrics.md: the headline numbers for the thesis, old and new
// side by side per N (medians, plus p95 in the CSV). Main configuration only
// (network none, CPU ×1 unless KEY_NETWORK / KEY_CPU say otherwise).

const KEY_NETWORK = opt('KEY_NETWORK', 'none');
const KEY_CPU = opt('KEY_CPU', '1');

const KEY_UI = [
  { scenario: 'initial_load', metric: 'first_row_ms', label: 'Wejście: pierwszy wiersz', unit: 's', scale: 1 / 1000, digits: 2 },
  { scenario: 'initial_load', metric: 'list_ready_ms', label: 'Wejście: lista gotowa', unit: 's', scale: 1 / 1000, digits: 2 },
  { scenario: 'initial_load', metric: 'tbt_ms', label: 'Wejście: Total Blocking Time', unit: 'ms', scale: 1, digits: 0 },
  { scenario: 'initial_load', metric: 'js_heap_used_bytes', label: 'Wejście: sterta JS', unit: 'MB', scale: 1 / 1e6, digits: 1 },
  { scenario: 'initial_load', metric: 'dom_nodes', label: 'Wejście: węzły DOM', unit: 'szt.', scale: 1, digits: 0 },
  { scenario: 'initial_load', metric: 'api_transfer_bytes', label: 'Wejście: transfer API', unit: 'kB', scale: 1 / 1e3, digits: 1 },
  { scenario: 'filter_change', metric: 'duration_ms', label: 'Zmiana filtra', unit: 'ms', scale: 1, digits: 0 },
  { scenario: 'sort_change', metric: 'duration_ms', label: 'Zmiana sortowania', unit: 'ms', scale: 1, digits: 0 },
  { scenario: 'scroll_pages', metric: 'duration_ms', label: 'Przewinięcie do 60. wiersza', unit: 's', scale: 1 / 1000, digits: 2 },
  { scenario: 'scroll_all', metric: 'duration_ms', label: 'Przewinięcie do końca listy', unit: 's', scale: 1 / 1000, digits: 1 },
  { scenario: 'scroll_all', metric: 'api_transfer_bytes', label: 'Do końca listy: transfer API', unit: 'MB', scale: 1 / 1e6, digits: 2 },
  { scenario: 'scroll_all', metric: 'api_requests', label: 'Do końca listy: żądania API', unit: 'szt.', scale: 1, digits: 0 },
];

const KEY_API = [
  { variant: 'old', case: 'list_full', metric: 'total_ms', label: 'API: cała lista (old)', unit: 'ms', scale: 1, digits: 0 },
  { variant: 'new', case: 'page_first', metric: 'total_ms', label: 'API: 1. strona (new)', unit: 'ms', scale: 1, digits: 0 },
  { variant: 'new', case: 'page_last', metric: 'total_ms', label: 'API: ostatnia pełna strona (new)', unit: 'ms', scale: 1, digits: 0 },
  { variant: 'new', case: 'all_pages', metric: 'total_ms', label: 'API: wszystkie strony (new)', unit: 'ms', scale: 1, digits: 0 },
  { variant: 'old', case: 'list_full', metric: 'bytes_raw', label: 'API: rozmiar całej listy (old)', unit: 'kB', scale: 1 / 1e3, digits: 0 },
  { variant: 'new', case: 'page_first', metric: 'bytes_raw', label: 'API: rozmiar strony (new)', unit: 'kB', scale: 1 / 1e3, digits: 1 },
];

function writeKeyTables(uiSummary, apiSummary) {
  const csvRows = [];
  const ns = [...new Set([...uiSummary, ...apiSummary].map((r) => Number(r.n)))].sort((a, b) => a - b);
  const fmt = (v, digits) =>
    Number.isFinite(v) ? v.toLocaleString('pl-PL', { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '';

  const ui = uiSummary.filter((r) => r.network === KEY_NETWORK && String(r.cpu) === KEY_CPU);
  const mdRows = [];
  for (const spec of KEY_UI) {
    const cells = ns.map((n) => {
      const get = (variant) => ui.find((r) => r.variant === variant && Number(r.n) === n && r.scenario === spec.scenario && r.metric === spec.metric);
      const old = get('old');
      const neu = get('new');
      for (const [variant, r] of [['old', old], ['new', neu]]) {
        csvRows.push({
          n, metric: spec.label, unit: spec.unit, variant,
          median: r ? r.median * spec.scale : '', p95: r ? r.p95 * spec.scale : '', count: r ? r.count : 0,
        });
      }
      return `${old ? fmt(old.median * spec.scale, spec.digits) : '—'} / ${neu ? fmt(neu.median * spec.scale, spec.digits) : '—'}`;
    });
    mdRows.push(`| ${spec.label} [${spec.unit}] | ${cells.join(' | ')} |`);
  }
  for (const spec of KEY_API) {
    const cells = ns.map((n) => {
      const r = apiSummary.find((x) => x.variant === spec.variant && x.case === spec.case && Number(x.n) === n && x.metric === spec.metric);
      csvRows.push({
        n, metric: spec.label, unit: spec.unit, variant: spec.variant,
        median: r ? r.median * spec.scale : '', p95: r ? r.p95 * spec.scale : '', count: r ? r.count : 0,
      });
      return r ? fmt(r.median * spec.scale, spec.digits) : '—';
    });
    mdRows.push(`| ${spec.label} [${spec.unit}] | ${cells.join(' | ')} |`);
  }

  writeCsv(path.join(OUT_DIR, 'key-metrics.csv'), ['n', 'metric', 'unit', 'variant', 'median', 'p95', 'count'], csvRows);
  const md = [
    `# Kluczowe metryki: old / new`,
    '',
    `Mediany; w komórkach UI: **old / new**. Konfiguracja: sieć ${KEY_NETWORK}, CPU ×${KEY_CPU}. ` +
      '„—” = brak udanego pomiaru (np. old przy N = 10 000: lista nie wyrenderowała się w limicie czasu). ' +
      'p95 i liczba przebiegów: key-metrics.csv, pełne statystyki: summary.csv / api-summary.csv.',
    '',
    `| metryka | ${ns.map((n) => `N = ${n.toLocaleString('pl-PL')}`).join(' | ')} |`,
    `|---|${ns.map(() => '---:').join('|')}|`,
    ...mdRows,
    '',
  ].join('\n');
  const mdFile = path.join(OUT_DIR, 'key-metrics.md');
  assertNotRawInput(mdFile);
  fs.writeFileSync(mdFile, md);
  console.log(`wrote ${path.relative(PERF_DIR, mdFile)}`);
}

/** Readable unit for a panel, chosen from the largest value it shows (raw ms / bytes / count). */
function pickUnit(kind, maxValue, noun = '') {
  if (kind === 'time') return maxValue >= 2000 ? { unit: 's', scale: 1 / 1000 } : { unit: 'ms', scale: 1 };
  if (kind === 'bytes') {
    if (maxValue >= 1e6) return { unit: 'MB', scale: 1 / 1e6 };
    if (maxValue >= 1e3) return { unit: 'kB', scale: 1 / 1e3 };
    return { unit: 'B', scale: 1 };
  }
  return maxValue >= 1e4 ? { unit: `tys. ${noun}`.trim(), scale: 1 / 1000 } : { unit: noun || 'liczba', scale: 1 };
}

/** Panel = spec + series in legend order, scaled to a readable unit. */
function buildPanel(spec, rows, nameOf, order) {
  const max = Math.max(0, ...rows.flatMap((r) => [r.median, r.p95]).filter(Number.isFinite));
  const { unit, scale } = pickUnit(spec.kind, max, spec.noun);
  return { ...spec, unit, series: toSeries(rows, nameOf, order, scale) };
}

/** Summary rows of one metric -> series (name from nameOf) in the given legend order. */
function toSeries(rows, nameOf, order, scale = 1) {
  const byName = new Map();
  for (const row of rows) {
    const name = nameOf(row);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push({ n: Number(row.n), median: row.median * scale, p95: row.p95 * scale });
  }
  return [...byName.entries()]
    .map(([name, points]) => ({ name, points }))
    .sort((x, y) => order.indexOf(x.name) - order.indexOf(y.name));
}

function confLabel(conf) {
  const network = { none: 'bez ograniczeń sieci', fast4g: 'sieć Fast 4G', slow4g: 'sieć Slow 4G' }[conf.network] ?? `sieć ${conf.network}`;
  return `${network} · CPU ×${conf.cpu}`;
}

// -------------------------------------------------------------------- main ---

async function main() {
  const figures = [];
  let uiSummary = [];
  let apiSummary = [];

  if (fs.existsSync(RESULTS)) {
    const rows = markIncompleteScrolls(readCsv(RESULTS));
    const summary = (uiSummary = summarize(rows, UI_KEYS, UI_METRICS, (r) => r.status === 'ok', (groupRows) => {
      const count = (s) => groupRows.filter((r) => r.status === s).length;
      return {
        runs: groupRows.length,
        ok: count('ok'),
        incomplete: count('incomplete'),
        timeout: count('timeout'),
        error: count('error'),
        skipped: count('skipped'),
      };
    }));
    writeCsv(
      path.join(OUT_DIR, 'summary.csv'),
      [...UI_KEYS, 'metric', 'runs', 'ok', 'incomplete', 'timeout', 'error', 'skipped', ...SUMMARY_STATS],
      summary
    );

    const order = ['old', 'new'];
    for (const { key: conf, rows: confRows } of groupBy(summary, ['network', 'cpu'])) {
      const variants = order.filter((v) => confRows.some((r) => r.variant === v));
      const panels = UI_PANELS.map((spec) =>
        buildPanel(spec, confRows.filter((r) => r.scenario === spec.scenario && r.metric === spec.metric), (r) => r.variant, order)
      );
      const name = `overview-${conf.network}-cpu${conf.cpu}`;
      figures.push({
        file: name,
        svg: figureSvg({
          title: 'Lista zgłoszeń: old vs new',
          subtitle: `${confLabel(conf)} · mediana z przebiegów ze statusem ok`,
          panels,
          seriesNames: variants,
          cols: 3,
          logY: LOG_Y,
        }),
      });
      if (INDIVIDUAL) {
        for (const panel of panels.filter((p) => p.series.length)) {
          figures.push({
            file: `${panel.scenario}-${panel.metric}-${conf.network}-cpu${conf.cpu}`,
            svg: figureSvg({ title: panel.title, subtitle: confLabel(conf), panels: [panel], seriesNames: variants, cols: 1, logY: LOG_Y }),
          });
        }
      }
    }
  } else {
    console.log(`(no ${path.relative(PERF_DIR, RESULTS)})`);
  }

  if (fs.existsSync(API_RESULTS)) {
    const rows = readCsv(API_RESULTS);
    const summary = (apiSummary = summarize(rows, API_KEYS, API_METRICS, (r) => r.status === '200'));
    writeCsv(path.join(OUT_DIR, 'api-summary.csv'), [...API_KEYS, 'metric', ...SUMMARY_STATS], summary);

    const chosen = summary.filter((r) => API_CHART_CASES.includes(`${r.variant}:${r.case}`));
    const names = API_CHART_CASES.filter((c) => chosen.some((r) => `${r.variant}:${r.case}` === c));
    const panels = API_PANELS.map((spec) =>
      buildPanel(spec, chosen.filter((r) => r.metric === spec.metric), (r) => `${r.variant}:${r.case}`, API_CHART_CASES)
    );
    figures.push({
      file: 'api-overview',
      svg: figureSvg({
        title: 'Endpoint listy: old vs new',
        subtitle: 'bezpośrednie zapytania HTTP, bez przeglądarki',
        panels,
        seriesNames: names,
        cols: 2,
        logY: LOG_Y,
      }),
    });
  }

  if (uiSummary.length || apiSummary.length) writeKeyTables(uiSummary, apiSummary);

  if (!figures.length) return;
  const dir = path.join(OUT_DIR, 'charts');
  fs.mkdirSync(dir, { recursive: true });
  // Charts are regenerated as a set; drop files from the previous layout.
  for (const f of fs.readdirSync(dir)) if (/\.(png|svg)$/.test(f)) fs.rmSync(path.join(dir, f));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ deviceScaleFactor: 2 });
    for (const figure of figures) {
      fs.writeFileSync(path.join(dir, `${figure.file}.svg`), figure.svg);
      await page.setContent(`<!doctype html><html><body style="margin:0">${figure.svg}</body></html>`);
      await page.locator('svg').screenshot({ path: path.join(dir, `${figure.file}.png`) });
    }
  } finally {
    await browser.close();
  }
  console.log(`wrote ${figures.length} figure(s) (PNG + SVG) to ${path.relative(PERF_DIR, dir)}/: ${figures.map((f) => f.file).join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
