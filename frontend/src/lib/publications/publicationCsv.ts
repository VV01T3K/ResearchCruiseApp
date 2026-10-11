import Papa from 'papaparse';

import type { ImportPublicationRequest } from '@/api/generated/schemas';

const COLUMNS = {
  doi: 'Numer DOI',
  authors: 'Autorzy',
  title: 'Tytuł publikacji',
  magazine: 'Nazwa czasopisma',
  year: 'Rok',
  ministerialPoints: 'Punkty',
} as const;

const DELIMITER = ';';
// Older exports from the university repository (BG UG) are encoded as Windows-1250.
const LEGACY_ENCODING = 'windows-1250';

export class PublicationCsvError extends Error {
  override name = 'PublicationCsvError';
}

/**
 * Decodes publication CSV bytes as UTF-8 (with or without BOM) and falls back to
 * the legacy Windows-1250 encoding when the bytes are not valid UTF-8.
 */
export function decodePublicationCsv(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);

  if (view.includes(0)) {
    throw new PublicationCsvError('Wybrany plik nie jest plikiem tekstowym CSV.');
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(view);
  } catch {
    return new TextDecoder(LEGACY_ENCODING).decode(view);
  }
}

/**
 * Parses a semicolon-separated publication export into import requests.
 * Throws PublicationCsvError with a user-facing Polish message when the file is malformed.
 */
export function parsePublicationCsv(text: string): ImportPublicationRequest[] {
  if (text.trim() === '') {
    throw new PublicationCsvError('Plik CSV jest pusty.');
  }

  const [header, ...rows] = parseRecords(text);
  const headers = header.fields.map((field) => field.replace(/^\uFEFF/, '').trim());
  const missingColumns = Object.values(COLUMNS).filter((column) => !headers.includes(column));
  if (missingColumns.length > 0) {
    const separatorHint =
      headers.length === 1 && headers[0].includes(',') ? ' Kolumny muszą być oddzielone średnikiem (;).' : '';
    throw new PublicationCsvError(
      `W pliku CSV brakuje kolumn: ${missingColumns.map((column) => `„${column}”`).join(', ')}.${separatorHint}`
    );
  }

  for (const record of [header, ...rows]) {
    const [error] = record.errors;
    if (error) {
      throw new PublicationCsvError(
        error.code === 'MissingQuotes'
          ? `Niezamknięty cudzysłów w wierszu ${record.line} pliku CSV.`
          : `Nie udało się odczytać wiersza ${record.line} pliku CSV.`
      );
    }
    if (record.fields.length !== headers.length) {
      throw new PublicationCsvError(
        `Niepoprawna liczba kolumn w wierszu ${record.line} pliku CSV (oczekiwano ${headers.length}).`
      );
    }
  }

  if (rows.length === 0) {
    throw new PublicationCsvError('Plik CSV nie zawiera żadnych publikacji.');
  }

  return rows.map((record) => toImportRequest(Object.fromEntries(headers.map((h, i) => [h, record.fields[i]]))));
}

export async function readPublicationCsv(file: Blob): Promise<ImportPublicationRequest[]> {
  return parsePublicationCsv(decodePublicationCsv(await file.arrayBuffer()));
}

type CsvRecord = { fields: string[]; errors: Papa.ParseError[]; line: number };

// Parses records with the file line each one starts on, so errors point at the right line
// even after skipped blank lines or quoted values spanning several lines.
function parseRecords(text: string): CsvRecord[] {
  const records: CsvRecord[] = [];
  let offset = 0;

  Papa.parse<string[]>(text, {
    delimiter: DELIMITER,
    skipEmptyLines: 'greedy',
    step: (result) => {
      // Skipped blank lines sit between the previous record and this one.
      const start = offset + (text.slice(offset).match(/^[\s;]*/)?.[0].length ?? 0);
      records.push({ fields: result.data, errors: result.errors, line: text.slice(0, start).split('\n').length });
      offset = result.meta.cursor;
    },
  });

  return records;
}

function toImportRequest(row: Record<string, string>): ImportPublicationRequest {
  const value = (column: string) => row[column]?.trim() || '-';

  return {
    category: 'subject',
    doi: value(COLUMNS.doi),
    authors: value(COLUMNS.authors),
    title: value(COLUMNS.title),
    magazine: value(COLUMNS.magazine),
    year: value(COLUMNS.year),
    ministerialPoints: value(COLUMNS.ministerialPoints),
  };
}
