// Deterministic test-data seeder for the cruise applications list, independent
// of the application code (works on the v2.5.1 schema and on staging; the tables
// it touches - AspNetUsers, AspNetUserRoles, FormsA, CruiseApplications - are
// identical in both).
//
//   node seed.mjs --n 1000            replace previous perf data with 1000 applications
//   node seed.mjs --remove            remove all perf data
//
// Options (env or --flag): N, MANAGERS (30), SEED (42), REFERENCE_DATE (2026-09-01),
// DB_CONNECTION_STRING (default: read from APPSETTINGS_FILE, i.e. the backend's
// appsettings.Development.json).
//
// Each application i is generated from its own PRNG stream derived from (SEED, i),
// so the data for a given N is identical on every run and every branch, and a
// smaller N is a subset of a larger one. No cruises are created: the list only
// shows cruise dates, which are irrelevant here and would only add noise.

import fs from 'node:fs';
import path from 'node:path';
import sql from 'mssql';

import { PERF_DIR, intOpt, opt } from './lib/config.mjs';

const TAG = '[PERF-SEED]';
const EMAIL_DOMAIN = 'perf-seed.test';

// ---------------------------------------------------------------- PRNG ------

function hash32(a, b) {
  let h = (a ^ Math.imul(b + 0x9e3779b9, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

function weighted(rng, entries) {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [value, w] of entries) {
    if ((r -= w) < 0) return value;
  }
  return entries[entries.length - 1][0];
}

function uuid(rng) {
  const b = Array.from({ length: 16 }, () => Math.floor(rng() * 256));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ---------------------------------------------------------------- data ------

// CruiseApplicationStatus (same order in v2.5.1 and staging).
const S = {
  Draft: 0,
  WaitingForSupervisor: 1,
  AcceptedBySupervisor: 2,
  DeniedBySupervisor: 3,
  Accepted: 4,
  Denied: 5,
  FormBRequired: 6,
  FormBFilled: 7,
  Undertaken: 8,
  Reported: 9,
};

// Status depends on how far the cruise year is from the reference date: past
// cruises are mostly settled, upcoming ones are still in the approval pipeline.
const STATUS_WEIGHTS = {
  past: [
    [S.Reported, 45], [S.Undertaken, 15], [S.Denied, 12], [S.DeniedBySupervisor, 5],
    [S.Accepted, 6], [S.FormBFilled, 4], [S.FormBRequired, 3], [S.Draft, 6], [S.WaitingForSupervisor, 2],
    [S.AcceptedBySupervisor, 2],
  ],
  current: [
    [S.FormBFilled, 22], [S.FormBRequired, 14], [S.Accepted, 14], [S.Undertaken, 16], [S.Reported, 6],
    [S.Denied, 8], [S.WaitingForSupervisor, 5], [S.AcceptedBySupervisor, 6], [S.Draft, 6], [S.DeniedBySupervisor, 3],
  ],
  future: [
    [S.Draft, 20], [S.WaitingForSupervisor, 24], [S.AcceptedBySupervisor, 22], [S.Accepted, 12], [S.Denied, 8],
    [S.DeniedBySupervisor, 7], [S.FormBRequired, 7],
  ],
};

const FEMALE_FIRST = ['Anna', 'Katarzyna', 'Magdalena', 'Ewa', 'Agnieszka', 'Joanna', 'Monika', 'Aleksandra', 'Natalia', 'Barbara'];
const MALE_FIRST = ['Piotr', 'Tomasz', 'Marek', 'Jan', 'Paweł', 'Krzysztof', 'Michał', 'Andrzej', 'Wojciech', 'Jakub'];
const LAST = [
  ['Nowak', 'Nowak'], ['Kowalska', 'Kowalski'], ['Wiśniewska', 'Wiśniewski'], ['Wójcik', 'Wójcik'],
  ['Kowalczyk', 'Kowalczyk'], ['Kamińska', 'Kamiński'], ['Lewandowska', 'Lewandowski'], ['Zielińska', 'Zieliński'],
  ['Szymańska', 'Szymański'], ['Woźniak', 'Woźniak'], ['Dąbrowska', 'Dąbrowski'], ['Kozłowska', 'Kozłowski'],
  ['Jankowska', 'Jankowski'], ['Mazur', 'Mazur'], ['Krawczyk', 'Krawczyk'], ['Piotrowska', 'Piotrowski'],
];
const GOAL_PHRASES = [
  'Pobór prób osadów dennych', 'Pomiary CTD w profilu pionowym', 'Monitoring zakwitów sinic',
  'Badania hydroakustyczne zasobów ryb', 'Kartowanie dna sonarem bocznym', 'Pobór prób planktonu',
  'Zajęcia terenowe dla studentów oceanografii', 'Testy nowej aparatury pomiarowej',
];

function makeManagers(seed, count) {
  const rng = mulberry32(hash32(seed, 0x6d616e)); // "man"
  return Array.from({ length: count }, (_, i) => {
    const female = rng() < 0.5;
    const [lastF, lastM] = pick(rng, LAST);
    const firstName = pick(rng, female ? FEMALE_FIRST : MALE_FIRST);
    const email = `perf-manager-${String(i + 1).padStart(3, '0')}@${EMAIL_DOMAIN}`;
    return {
      id: uuid(rng),
      firstName,
      lastName: female ? lastF : lastM,
      email,
      securityStamp: uuid(rng).replaceAll('-', '').toUpperCase(),
      concurrencyStamp: uuid(rng),
    };
  });
}

/** Zipf-like activity: a few managers submit many applications, most submit few. */
function managerWeights(count) {
  return Array.from({ length: count }, (_, i) => [i, 1 / Math.pow(i + 1, 0.8)]);
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

const isoDate = (d) => d.toISOString().slice(0, 10);

function makeApplication(seed, index, refDate, managers, weights) {
  const rng = mulberry32(hash32(seed, index + 1));
  const date = addDays(refDate, -int(rng, 0, 4 * 365));
  const year = date.getUTCFullYear() + (rng() < 0.75 ? 1 : 0);
  const refYear = refDate.getUTCFullYear();
  const phase = year < refYear ? 'past' : year === refYear ? 'current' : 'future';
  const status = weighted(rng, STATUS_WEIGHTS[phase]);

  const managerIdx = weighted(rng, weights);
  let deputyIdx = int(rng, 0, managers.length - 2);
  if (deputyIdx >= managerIdx) deputyIdx++;

  const days = weighted(rng, [[1, 18], [2, 16], [3, 14], [4, 10], [5, 10], [7, 10], [10, 8], [14, 8], [21, 4], [30, 2]]);
  const cruiseHours = days * 24 - (rng() < 0.2 ? 12 : 0);

  const precise = rng() < 0.2;
  let optimalBeg = null, optimalEnd = null, acceptableBeg = null, acceptableEnd = null;
  let preciseStart = null, preciseEnd = null;
  if (precise) {
    const start = new Date(Date.UTC(year, 0, 1, 8));
    start.setUTCDate(start.getUTCDate() + int(rng, 0, 330));
    preciseStart = start;
    preciseEnd = new Date(start.getTime() + cruiseHours * 3600 * 1000);
  } else {
    // Half-month edges 0..24 as used by the form; acceptable range contains the optimal one.
    const oBeg = int(rng, 2, 18);
    const oEnd = Math.min(24, oBeg + int(rng, 1, 4));
    const aBeg = Math.max(0, oBeg - int(rng, 0, 4));
    const aEnd = Math.min(24, oEnd + int(rng, 0, 4));
    [optimalBeg, optimalEnd, acceptableBeg, acceptableEnd] = [oBeg, oEnd, aBeg, aEnd].map(String);
  }

  const hasEffects = status === S.Undertaken || status === S.Reported;
  return {
    formAId: uuid(rng),
    appId: uuid(rng),
    date,
    status,
    effectsPoints: hasEffects ? int(rng, 0, 20) : 0,
    note: status === S.Draft ? `${TAG} szkic ${index + 1}` : `${TAG} ${index + 1}`,
    supervisorCode: Buffer.from(Array.from({ length: 16 }, () => Math.floor(rng() * 256))),
    formA: {
      cruiseManagerId: managers[managerIdx].id,
      deputyManagerId: managers[deputyIdx].id,
      year: String(year),
      acceptableBeg,
      acceptableEnd,
      optimalBeg,
      optimalEnd,
      cruiseHours: String(cruiseHours),
      periodNotes: rng() < 0.3 ? 'Termin zależny od warunków pogodowych.' : '',
      shipUsage: String(weighted(rng, [[0, 60], [1, 20], [2, 10], [3, 6], [4, 4]])),
      differentUsage: '',
      cruiseGoal: String(int(rng, 0, 2)),
      cruiseGoalDescription: `${pick(rng, GOAL_PHRASES)} (${TAG} ${index + 1}). ${pick(rng, GOAL_PHRASES)}.`,
      ugUnitsPoints: String(weighted(rng, [[0, 50], [50, 30], [100, 20]])),
      supervisorEmail: `supervisor-${int(rng, 1, 200)}@${EMAIL_DOMAIN}`,
      preciseStart,
      preciseEnd,
      periodSelectionType: precise ? 'precise' : 'period',
    },
  };
}

// ---------------------------------------------------------------- db --------

function connectionConfig() {
  let cs = opt('DB_CONNECTION_STRING', undefined);
  if (!cs) {
    const file = path.resolve(PERF_DIR, opt('APPSETTINGS_FILE', '../backend/ResearchCruiseApp/appsettings.Development.json'));
    if (!fs.existsSync(file)) throw new Error(`Set DB_CONNECTION_STRING (no ${file})`);
    const json = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
    cs = json.ConnectionStrings?.Database;
    if (!cs) throw new Error(`No ConnectionStrings.Database in ${file}`);
  }
  const parts = Object.fromEntries(
    cs.split(';').map((p) => p.split('=')).filter((kv) => kv.length >= 2).map(([k, ...v]) => [k.trim().toLowerCase(), v.join('=').trim()])
  );
  const [server, port] = (parts.server ?? parts['data source'] ?? 'localhost').split(',').map((s) => s.trim());
  return {
    server: server.replace(/^tcp:/i, ''),
    port: Number(port ?? 1433),
    database: parts.database ?? parts['initial catalog'],
    user: parts['user id'] ?? parts.uid,
    password: parts.password ?? parts.pwd,
    options: { encrypt: /^true$/i.test(parts.encrypt ?? 'false'), trustServerCertificate: true },
    requestTimeout: 600_000,
  };
}

async function removePerfData(pool) {
  const like = `%@${EMAIL_DOMAIN}`;
  const result = await pool.request().input('like', sql.NVarChar, like).query(`
    SET NOCOUNT ON;
    DECLARE @apps INT, @forms INT, @users INT;
    DELETE ca FROM CruiseApplications ca JOIN FormsA fa ON fa.Id = ca.FormAId WHERE fa.SupervisorEmail LIKE @like;
    SET @apps = @@ROWCOUNT;
    DELETE FROM FormsA WHERE SupervisorEmail LIKE @like;
    SET @forms = @@ROWCOUNT;
    DELETE ur FROM AspNetUserRoles ur JOIN AspNetUsers u ON u.Id = ur.UserId WHERE u.Email LIKE @like;
    DELETE FROM AspNetUsers WHERE Email LIKE @like;
    SET @users = @@ROWCOUNT;
    SELECT @apps AS apps, @forms AS forms, @users AS users;
  `);
  const removed = result.recordset[0];
  if (removed.apps > 0) {
    // Keep application numbers reproducible (1..N on a database without other applications).
    await pool.request().query(`
      DECLARE @max INT = (SELECT ISNULL(MAX(Number), 0) FROM CruiseApplications);
      DBCC CHECKIDENT ('CruiseApplications', RESEED, @max) WITH NO_INFOMSGS;
    `);
  }
  return removed;
}

async function insertManagers(tx, managers) {
  const role = await new sql.Request(tx).query(`SELECT Id FROM AspNetRoles WHERE Name = 'CruiseManager'`);
  const roleId = role.recordset[0]?.Id;
  if (!roleId) throw new Error('Role CruiseManager not found - start the backend once so it seeds roles');

  const users = new sql.Table('AspNetUsers');
  users.create = false;
  users.columns.add('Id', sql.NVarChar(450), { nullable: false });
  users.columns.add('FirstName', sql.NVarChar(1024), { nullable: false });
  users.columns.add('LastName', sql.NVarChar(1024), { nullable: false });
  users.columns.add('Accepted', sql.Bit, { nullable: false });
  users.columns.add('UserName', sql.NVarChar(256), { nullable: true });
  users.columns.add('NormalizedUserName', sql.NVarChar(256), { nullable: true });
  users.columns.add('Email', sql.NVarChar(256), { nullable: true });
  users.columns.add('NormalizedEmail', sql.NVarChar(256), { nullable: true });
  users.columns.add('EmailConfirmed', sql.Bit, { nullable: false });
  users.columns.add('SecurityStamp', sql.NVarChar(sql.MAX), { nullable: true });
  users.columns.add('ConcurrencyStamp', sql.NVarChar(sql.MAX), { nullable: true });
  users.columns.add('PhoneNumberConfirmed', sql.Bit, { nullable: false });
  users.columns.add('TwoFactorEnabled', sql.Bit, { nullable: false });
  users.columns.add('LockoutEnabled', sql.Bit, { nullable: false });
  users.columns.add('AccessFailedCount', sql.Int, { nullable: false });
  for (const m of managers) {
    users.rows.add(m.id, m.firstName, m.lastName, true, m.email, m.email.toUpperCase(), m.email, m.email.toUpperCase(),
      true, m.securityStamp, m.concurrencyStamp, false, false, true, 0);
  }
  await new sql.Request(tx).bulk(users);

  const roles = new sql.Table('AspNetUserRoles');
  roles.create = false;
  roles.columns.add('UserId', sql.NVarChar(450), { nullable: false });
  roles.columns.add('RoleId', sql.NVarChar(450), { nullable: false });
  for (const m of managers) roles.rows.add(m.id, roleId);
  await new sql.Request(tx).bulk(roles);
}

async function insertApplications(tx, apps) {
  const forms = new sql.Table('FormsA');
  forms.create = false;
  forms.columns.add('Id', sql.UniqueIdentifier, { nullable: false });
  forms.columns.add('CruiseManagerId', sql.UniqueIdentifier, { nullable: false });
  forms.columns.add('DeputyManagerId', sql.UniqueIdentifier, { nullable: false });
  forms.columns.add('Year', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('AcceptablePeriodBeg', sql.NVarChar(1024), { nullable: true });
  forms.columns.add('AcceptablePeriodEnd', sql.NVarChar(1024), { nullable: true });
  forms.columns.add('OptimalPeriodBeg', sql.NVarChar(1024), { nullable: true });
  forms.columns.add('OptimalPeriodEnd', sql.NVarChar(1024), { nullable: true });
  forms.columns.add('CruiseHours', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('PeriodNotes', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('ShipUsage', sql.NVarChar(1024), { nullable: true });
  forms.columns.add('DifferentUsage', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('CruiseGoal', sql.NVarChar(sql.MAX), { nullable: true });
  forms.columns.add('CruiseGoalDescription', sql.NVarChar(sql.MAX), { nullable: false });
  forms.columns.add('UgUnitsPoints', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('SupervisorEmail', sql.NVarChar(1024), { nullable: false });
  forms.columns.add('PrecisePeriodEnd', sql.DateTime2, { nullable: true });
  forms.columns.add('PrecisePeriodStart', sql.DateTime2, { nullable: true });
  forms.columns.add('PeriodSelectionType', sql.NVarChar(16), { nullable: true });
  for (const a of apps) {
    const f = a.formA;
    forms.rows.add(a.formAId, f.cruiseManagerId, f.deputyManagerId, f.year, f.acceptableBeg, f.acceptableEnd,
      f.optimalBeg, f.optimalEnd, f.cruiseHours, f.periodNotes, f.shipUsage, f.differentUsage, f.cruiseGoal,
      f.cruiseGoalDescription, f.ugUnitsPoints, f.supervisorEmail, f.preciseEnd, f.preciseStart, f.periodSelectionType);
  }
  await new sql.Request(tx).bulk(forms);

  // Number is an IDENTITY column; rows are inserted in submission-date order so
  // numbers grow with dates, as in the real system.
  const table = new sql.Table('CruiseApplications');
  table.create = false;
  table.columns.add('Id', sql.UniqueIdentifier, { nullable: false });
  table.columns.add('Date', sql.Date, { nullable: false });
  table.columns.add('FormAId', sql.UniqueIdentifier, { nullable: true });
  table.columns.add('Status', sql.Int, { nullable: false });
  table.columns.add('SupervisorCode', sql.VarBinary(sql.MAX), { nullable: false });
  table.columns.add('EffectsPoints', sql.Int, { nullable: false });
  table.columns.add('Note', sql.NVarChar(1024), { nullable: true });
  for (const a of apps) {
    table.rows.add(a.appId, a.date, a.formAId, a.status, a.supervisorCode, a.effectsPoints, a.note);
  }
  await new sql.Request(tx).bulk(table);
}

async function main() {
  const remove = opt('REMOVE', 'false') === 'true';
  const n = intOpt('N', undefined);
  const managersCount = intOpt('MANAGERS', 30);
  const seed = intOpt('SEED', 42);
  const refDate = new Date(`${opt('REFERENCE_DATE', '2026-09-01')}T00:00:00Z`);
  if (!remove && !(n >= 0)) throw new Error('Give --n <count> (or --remove)');
  if (managersCount < 2) throw new Error('MANAGERS must be >= 2');

  const pool = await sql.connect(connectionConfig());
  try {
    const removed = await removePerfData(pool);
    console.log(`Removed previous perf data: ${removed.apps} applications, ${removed.forms} forms A, ${removed.users} users.`);
    if (remove) return;

    const t0 = Date.now();
    const managers = makeManagers(seed, managersCount);
    const weights = managerWeights(managersCount);
    const apps = Array.from({ length: n }, (_, i) => makeApplication(seed, i, refDate, managers, weights));
    apps.sort((a, b) => a.date - b.date || (a.appId < b.appId ? -1 : 1));

    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      await insertManagers(tx, managers);
      // Chunks keep memory bounded for large N.
      for (let i = 0; i < apps.length; i += 5000) {
        await insertApplications(tx, apps.slice(i, i + 5000));
      }
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }

    const stats = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM CruiseApplications) AS total,
        (SELECT COUNT(*) FROM CruiseApplications ca JOIN FormsA fa ON fa.Id = ca.FormAId
           WHERE fa.SupervisorEmail LIKE '%@${EMAIL_DOMAIN}') AS perf,
        (SELECT MIN(Number) FROM CruiseApplications) AS minNumber,
        (SELECT MAX(Number) FROM CruiseApplications) AS maxNumber
    `);
    const s = stats.recordset[0];
    console.log(`Seeded ${n} applications, ${managersCount} managers (seed=${seed}, reference=${isoDate(refDate)}) in ${((Date.now() - t0) / 1000).toFixed(1)} s.`);
    console.log(`CruiseApplications: total=${s.total}, perf=${s.perf}, numbers ${s.minNumber}..${s.maxNumber}`);
    if (s.total !== s.perf) {
      console.warn(`WARNING: ${s.total - s.perf} non-perf applications exist; the list will show N + ${s.total - s.perf} rows.`);
    }

    const byYear = await pool.request().query(`
      SELECT fa.Year, COUNT(*) AS c FROM CruiseApplications ca JOIN FormsA fa ON fa.Id = ca.FormAId
      WHERE fa.SupervisorEmail LIKE '%@${EMAIL_DOMAIN}' GROUP BY fa.Year ORDER BY fa.Year`);
    console.log('Per cruise year: ' + byYear.recordset.map((r) => `${r.Year}=${r.c}`).join(', '));
  } finally {
    await pool.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
