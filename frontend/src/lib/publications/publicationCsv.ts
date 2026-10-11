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

  const result = Papa.parse<Record<string, string>>(text, {
    delimiter: DELIMITER,
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.replace(/^﻿/, '').trim(),
  });

  const headers = result.meta.fields ?? [];
  const missingColumns = Object.values(COLUMNS).filter((column) => !headers.includes(column));
  if (missingColumns.length > 0) {
    const separatorHint =
      headers.length === 1 && headers[0].includes(',') ? ' Kolumny muszą być oddzielone średnikiem (;).' : '';
    throw new PublicationCsvError(
      `W pliku CSV brakuje kolumn: ${missingColumns.map((column) => `„${column}”`).join(', ')}.${separatorHint}`
    );
  }

  const [error] = result.errors;
  if (error) {
    throw new PublicationCsvError(describeParseError(error, text, headers.length));
  }

  if (result.data.length === 0) {
    throw new PublicationCsvError('Plik CSV nie zawiera żadnych publikacji.');
  }

  return result.data.map(toImportRequest);
}

export async function readPublicationCsv(file: Blob): Promise<ImportPublicationRequest[]> {
  return parsePublicationCsv(decodePublicationCsv(await file.arrayBuffer()));
}

function describeParseError(error: Papa.ParseError, text: string, columnCount: number): string {
  // Quote errors carry a character index; field count errors carry a 0-based data row following the header line.
  const line =
    error.code === 'MissingQuotes' && error.index !== undefined
      ? text.slice(0, error.index).split('\n').length
      : error.row !== undefined
        ? error.row + 2
        : undefined;
  const where = line !== undefined ? ` w wierszu ${line}` : '';

  switch (error.code) {
    case 'MissingQuotes':
      return `Niezamknięty cudzysłów${where} pliku CSV.`;
    case 'TooFewFields':
    case 'TooManyFields':
      return `Niepoprawna liczba kolumn${where} pliku CSV (oczekiwano ${columnCount}).`;
    default:
      return `Nie udało się odczytać pliku CSV${where}.`;
  }
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
