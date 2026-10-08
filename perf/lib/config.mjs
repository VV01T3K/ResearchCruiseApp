// Shared parameter handling. Every option can be given as an environment variable
// (VARIANT=old) or a CLI flag (--variant=old / --variant old); CLI wins.
// Nothing here depends on the application's source tree, so perf/ can be copied
// between branches (or kept outside the repository).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PERF_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseCliArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const body = arg.slice(2);
    const eq = body.indexOf('=');
    if (eq >= 0) {
      args[body.slice(0, eq)] = body.slice(eq + 1);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      args[body] = argv[++i];
    } else {
      args[body] = 'true';
    }
  }
  return args;
}

const cli = parseCliArgs(process.argv.slice(2));

/** Reads option NAME from --name / --NAME / env NAME. */
export function opt(name, fallback) {
  const lower = name.toLowerCase().replaceAll('_', '-');
  const value = cli[lower] ?? cli[name] ?? process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

export function intOpt(name, fallback) {
  const value = opt(name, undefined);
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`${name} must be an integer, got "${value}"`);
  return parsed;
}

export function numOpt(name, fallback) {
  const value = opt(name, undefined);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) throw new Error(`${name} must be a number, got "${value}"`);
  return parsed;
}

/**
 * Per-variant defaults. These describe the two application versions compared in
 * the thesis; every field can still be overridden individually.
 *  - old: release v2.5.1 (legacy REST API, tokens in localStorage, full list, client-side filter/sort)
 *  - new: staging (API v2, refresh token in HttpOnly cookie, keyset pagination, virtualized rows)
 */
const VARIANT_PROFILES = {
  old: {
    AUTH_MODE: 'legacy',
    LOGIN_PATH: '/account/login',
    API_LIST_PATH: '/api/CruiseApplications',
    // Exact list endpoint only (not /api/CruiseApplications/{id}/...).
    API_MATCH: '/\\/api\\/CruiseApplications(\\?|$)/i',
  },
  new: {
    AUTH_MODE: 'v2',
    LOGIN_PATH: '/v2/auth/login',
    API_LIST_PATH: '/v2/applications',
    // Exact list endpoint only (not /v2/applications/managers).
    API_MATCH: '/\\/v2\\/applications(\\?|$)/i',
  },
};

export function getVariant() {
  const variant = opt('VARIANT', undefined);
  if (!variant) throw new Error('VARIANT is required (old|new)');
  return variant;
}

/** Option with a per-variant default (falls back to the "new" profile for unknown variants). */
export function variantOpt(name, variant) {
  const profile = VARIANT_PROFILES[variant] ?? VARIANT_PROFILES.new;
  return opt(name, profile[name]);
}

/** "/regex/flags" -> RegExp, anything else -> substring matcher. */
export function toMatcher(spec) {
  const m = /^\/(.*)\/([a-z]*)$/s.exec(spec);
  if (m) {
    const re = new RegExp(m[1], m[2]);
    return (url) => re.test(url);
  }
  return (url) => url.includes(spec);
}

/**
 * Login data comes only from the project's seed output: PERF_PASSWORD, or the
 * credentials.log written by `mise run seed` (repo root). Nothing is hard-coded.
 */
export function getCredentials() {
  const email = opt('PERF_EMAIL', 'admin@gmail.com');
  let password = opt('PERF_PASSWORD', undefined);
  if (!password) {
    const file = path.resolve(PERF_DIR, opt('CREDENTIALS_FILE', '../credentials.log'));
    if (!fs.existsSync(file)) {
      throw new Error(`No PERF_PASSWORD and credentials file not found: ${file}`);
    }
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const emailMatch = /^Email:\s*(.+)$/.exec(lines[i].trim());
      if (emailMatch && emailMatch[1].trim().toLowerCase() === email.toLowerCase()) {
        const passMatch = /^Password:\s*(.+)$/.exec((lines[i + 1] ?? '').trim());
        if (passMatch) password = passMatch[1].trim();
      }
    }
    if (!password) throw new Error(`No password for ${email} in ${file}`);
  }
  return { email, password };
}

export function quantile(sorted, q) {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function describe(values) {
  const v = values.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (v.length === 0) return { count: 0, median: NaN, p95: NaN, std: NaN, mean: NaN, min: NaN, max: NaN };
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  // Sample standard deviation (n-1); 0 for a single value.
  const std = v.length > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (v.length - 1)) : 0;
  return {
    count: v.length,
    median: quantile(v, 0.5),
    p95: quantile(v, 0.95),
    std,
    mean,
    min: v[0],
    max: v[v.length - 1],
  };
}

// --- CSV -------------------------------------------------------------------

export function csvEscape(value) {
  if (value === undefined || value === null || (typeof value === 'number' && !Number.isFinite(value))) return '';
  const s = typeof value === 'number' ? String(Math.round(value * 1000) / 1000) : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

/**
 * Appends rows to a CSV. The header is written only when the file is created;
 * an existing file with a different header is rejected instead of being corrupted.
 */
export function appendCsv(file, columns, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const header = columns.join(',');
  if (fs.existsSync(file) && fs.statSync(file).size > 0) {
    const firstLine = fs.readFileSync(file, 'utf8').split(/\r?\n/, 1)[0];
    if (firstLine !== header) {
      throw new Error(`Existing ${file} has a different header. Use another RESULTS file.\n  file: ${firstLine}\n  want: ${header}`);
    }
  } else {
    fs.writeFileSync(file, header + '\n');
  }
  const body = rows.map((row) => columns.map((c) => csvEscape(row[c])).join(',')).join('\n');
  if (body) fs.appendFileSync(file, body + '\n');
}

export function readCsv(file) {
  const text = fs.readFileSync(file, 'utf8');
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}
