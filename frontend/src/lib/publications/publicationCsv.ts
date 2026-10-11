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

export class PublicationCsvError extends Error {}

export async function readPublicationCsv(file: Blob): Promise<ImportPublicationRequest[]> {
  const bytes = await file.arrayBuffer();
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    // Older exports from the university repository (BG UG) are encoded as Windows-1250.
    text = new TextDecoder('windows-1250').decode(bytes);
  }
  return parsePublicationCsv(text);
}

export function parsePublicationCsv(text: string): ImportPublicationRequest[] {
  const { data, errors, meta } = Papa.parse<Record<string, string>>(text, {
    delimiter: ';',
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  const missingColumns = Object.values(COLUMNS).filter((column) => !meta.fields?.includes(column));
  if (missingColumns.length > 0) {
    throw new PublicationCsvError(
      `W pliku CSV brakuje kolumn oddzielonych średnikiem: ${missingColumns.map((column) => `„${column}”`).join(', ')}.`
    );
  }

  // Field count errors number records rather than file lines, so blank lines and multi-line values don't shift them.
  const error = errors.find((candidate) => candidate.code !== 'MissingQuotes') ?? errors[0];
  if (error) {
    const which = error.code !== 'MissingQuotes' && error.row !== undefined ? ` publikacji nr ${error.row + 1}` : '';
    throw new PublicationCsvError(
      `Nie udało się odczytać${which} z pliku CSV. Sprawdź liczbę kolumn i zamknięcie cudzysłowów.`
    );
  }

  if (data.length === 0) {
    throw new PublicationCsvError('Plik CSV nie zawiera żadnych publikacji.');
  }

  return data.map((row) => {
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
  });
}
