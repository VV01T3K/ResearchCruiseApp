import Papa from 'papaparse';
import { readSheet, type SheetData } from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';

import { toast } from '@/components/shared/layout/toast';
import { CruiseDayValues } from '@/features/applications/schemas/types/CruiseDayValues';

const MAX_IMPORT_FILE_BYTES = 1024 * 1024;
const MAX_IMPORT_ROWS = 1000;
const MAX_DAY = 366;
const MAX_DAY_HOURS = 24;

const toNumber = (value: SheetData[number][number] | undefined) =>
  typeof value === 'number'
    ? value
    : Number(
        String(value ?? '')
          .trim()
          .replace(',', '.')
      ) || 0;

function joinPosition(cells: SheetData[number], columns: Record<string, number>): string {
  const cell = (index: number) => (index === -1 ? '' : String(cells[index] ?? '').trim());
  const group = (...indices: number[]) => indices.map(cell).filter(Boolean).join(' ');
  const coordinates = [
    group(columns.latDd, columns.latMm, columns.latDir),
    group(columns.lonDd, columns.lonMm, columns.lonDir),
  ]
    .filter(Boolean)
    .join(', ');
  return [coordinates, cell(columns.pointName)].filter(Boolean).join(' - ');
}

function checkRow(row: CruiseDayValues, fileRow: number) {
  if (!Number.isInteger(row.number) || row.number < 0 || row.number > MAX_DAY) {
    throw new Error(`Wiersz ${fileRow}: dzień musi być liczbą całkowitą od 0 do ${MAX_DAY}.`);
  }
  if (row.hours < 0 || row.hours > MAX_DAY_HOURS) {
    throw new Error(`Wiersz ${fileRow}: liczba godzin musi być liczbą od 0 do ${MAX_DAY_HOURS}.`);
  }
}

/**
 * Parses a CSV string and converts it to an array of CruiseDayValues objects
 * Expected CSV columns: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi etc
 * The columns can't contain the polish letters like 'ń'
 * Supports both comma and semicolon as delimiters
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export function parseCruiseDayDetailsFromCsv(csvContent: string): CruiseDayValues[] {
  const text = csvContent.replace(/^\uFEFF/, '').trimEnd();
  const delimiter = text
    .split('\n')
    .find((line) => line.trim())
    ?.includes(';')
    ? ';'
    : ',';
  const { data: lines, errors } = Papa.parse<string[]>(text, { delimiter });

  if (errors.length > 0) {
    throw new Error(
      'Nie udało się odczytać pliku. Sprawdź, czy to plik CSV lub XLSX zapisany z arkusza kalkulacyjnego.'
    );
  }

  if (lines.length < 2) {
    throw new Error('Plik CSV musi zawierać wiersz nagłówka i przynajmniej jeden wiersz danych');
  }

  let headers: string[];
  let headerRowIndex = 0;

  let columnIndices: Record<string, number>;

  let foundColumnsCount = 0;
  let latHeaderIndex = -1;
  let lonHeaderIndex = -1;

  do {
    headers = lines[headerRowIndex].map((h) => h.toLowerCase().trim());

    const findColumnIndex = (possibleNames: string[]): number => {
      const normalizedNames = possibleNames.map((name) => name.toLowerCase());
      for (const name of normalizedNames) {
        const index = headers.indexOf(name);
        if (index !== -1) {
          return index;
        }
      }
      return -1;
    };

    latHeaderIndex = findColumnIndex(['lat', 'latitude']);
    lonHeaderIndex = findColumnIndex(['long', 'longitude']);

    const latDdIdx = latHeaderIndex !== -1 ? latHeaderIndex : -1;
    const latMmIdx = latHeaderIndex !== -1 ? latHeaderIndex + 1 : -1;
    const latDirIdx = latHeaderIndex !== -1 ? latHeaderIndex + 2 : -1;

    const lonDdIdx = lonHeaderIndex !== -1 ? lonHeaderIndex : -1;
    const lonMmIdx = lonHeaderIndex !== -1 ? lonHeaderIndex + 1 : -1;
    const lonDirIdx = lonHeaderIndex !== -1 ? lonHeaderIndex + 2 : -1;

    columnIndices = {
      number: findColumnIndex(['number', 'day', 'dzien']),
      hours: findColumnIndex(['hours', 'godziny', 'liczba godzin']),
      taskName: findColumnIndex(['taskname', 'task name', 'zadanie', 'nazwa zadania', 'nazwa_zadania']),
      region: findColumnIndex(['region', 'rejon', 'rejon zadania', 'rejon_zadania']),
      latDd: latDdIdx,
      latMm: latMmIdx,
      latDir: latDirIdx,
      lonDd: lonDdIdx,
      lonMm: lonMmIdx,
      lonDir: lonDirIdx,
      pointName: findColumnIndex(['nazwa punktu']),
      comment: findColumnIndex(['comment', 'uwagi', 'remarks', 'notatki']),
    };

    foundColumnsCount = Object.values(columnIndices).filter((index) => index !== -1).length;

    headerRowIndex++;
  } while (foundColumnsCount === 0 && headerRowIndex < lines.length);
  headerRowIndex--;

  if (
    (latHeaderIndex !== -1 || lonHeaderIndex !== -1 || columnIndices.pointName !== -1) &&
    !(latHeaderIndex !== -1 && lonHeaderIndex !== -1 && columnIndices.pointName !== -1)
  ) {
    throw new Error(
      'Jeśli jedna z kolumn latitude(LAT), longitude(LONG) lub "Nazwa Punktu" jest obecna, wszystkie trzy muszą być obecne'
    );
  }

  const rows: CruiseDayValues[] = [];

  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    const values = lines[i];
    if (values.every((cell) => !cell.trim())) continue;

    const row: CruiseDayValues = {
      number: toNumber(values[columnIndices.number]),
      hours: toNumber(values[columnIndices.hours]),
      taskName: String(values[columnIndices.taskName] || '').trim(),
      region: String(values[columnIndices.region] || '').trim(),
      position: joinPosition(values, columnIndices),
      comment: String(values[columnIndices.comment] || '').trim(),
    };

    checkRow(row, i + 1);
    rows.push({ ...row, hours: Math.round(row.hours) });
  }

  if (rows.length === 0) {
    throw new Error('Plik CSV nie zawiera wierszy danych');
  }

  return rows;
}

/**
 * Parses an XLSX file and converts it to an array of CruiseDayValues objects
 * Supports the same columns as CSV: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export async function parseCruiseDayDetailsFromXlsx(file: File): Promise<CruiseDayValues[]> {
  let data: SheetData;
  try {
    data = await readSheet(file);
  } catch (error) {
    console.error(error);
    throw new Error('Nie udało się odczytać pliku XLSX. Sprawdź, czy plik nie jest uszkodzony.');
  }

  if (data.length < 2) {
    throw new Error('Plik XLSX musi zawierać wiersz nagłówka i przynajmniej jeden wiersz danych');
  }

  let headers = data[0].map((h) => String(h).toLowerCase().trim());
  let headerRowIndex = 0;

  const findColumnIndex = (possibleNames: string[]): number => {
    const normalizedNames = possibleNames.map((name) => name.toLowerCase());
    for (const name of normalizedNames) {
      const index = headers.indexOf(name);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  };

  let columnIndices: Record<string, number>;
  let foundColumnsCount = 0;
  let latHeaderIndex = -1;
  let lonHeaderIndex = -1;

  do {
    headers = data[headerRowIndex].map((h) => String(h).toLowerCase().trim());

    latHeaderIndex = findColumnIndex(['lat', 'latitude']);
    lonHeaderIndex = findColumnIndex(['long', 'longitude']);

    const latDdIdx = latHeaderIndex !== -1 ? latHeaderIndex : -1;
    const latMmIdx = latHeaderIndex !== -1 ? latHeaderIndex + 1 : -1;
    const latDirIdx = latHeaderIndex !== -1 ? latHeaderIndex + 2 : -1;

    const lonDdIdx = lonHeaderIndex !== -1 ? lonHeaderIndex : -1;
    const lonMmIdx = lonHeaderIndex !== -1 ? lonHeaderIndex + 1 : -1;
    const lonDirIdx = lonHeaderIndex !== -1 ? lonHeaderIndex + 2 : -1;

    columnIndices = {
      number: findColumnIndex(['number', 'day', 'dzien']),
      hours: findColumnIndex(['hours', 'godziny', 'liczba godzin']),
      taskName: findColumnIndex(['taskname', 'task name', 'zadanie', 'nazwa zadania', 'nazwa_zadania']),
      region: findColumnIndex(['region', 'rejon', 'rejon zadania', 'rejon_zadania']),
      latDd: latDdIdx,
      latMm: latMmIdx,
      latDir: latDirIdx,
      lonDd: lonDdIdx,
      lonMm: lonMmIdx,
      lonDir: lonDirIdx,
      pointName: findColumnIndex(['nazwa punktu']),
      comment: findColumnIndex(['comment', 'uwagi', 'remarks', 'notatki']),
    };

    foundColumnsCount = Object.values(columnIndices).filter((index) => index !== -1).length;

    headerRowIndex++;
  } while (foundColumnsCount === 0 && headerRowIndex < data.length);
  headerRowIndex--;

  if (
    (latHeaderIndex !== -1 || lonHeaderIndex !== -1 || columnIndices.pointName !== -1) &&
    !(latHeaderIndex !== -1 && lonHeaderIndex !== -1 && columnIndices.pointName !== -1)
  ) {
    throw new Error(
      'Jeśli jedna z kolumn Latitude(LAT), longitude(LONG) lub "Nazwa Punktu" jest obecna, wszystkie trzy muszą być obecne'
    );
  }

  const rows: CruiseDayValues[] = [];

  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];

    if (!row || row.every((cell) => !cell)) {
      continue;
    }

    const cruiseDay: CruiseDayValues = {
      number: toNumber(row[columnIndices.number]),
      hours: toNumber(row[columnIndices.hours]),
      taskName: String(row[columnIndices.taskName] || '').trim(),
      region: String(row[columnIndices.region] || '').trim(),
      position: joinPosition(row, columnIndices),
      comment: String(row[columnIndices.comment] || '').trim(),
    };

    checkRow(cruiseDay, i + 1);
    rows.push({ ...cruiseDay, hours: Math.round(cruiseDay.hours) });
  }

  if (rows.length === 0) {
    throw new Error('Plik XLSX nie zawiera wierszy danych');
  }

  return rows;
}

/**
 * Parses either CSV or XLSX file based on file extension
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export async function parseCruiseDayDetailsFromFile(file: File): Promise<CruiseDayValues[]> {
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new Error('Plik jest zbyt duży. Maksymalny rozmiar to 1 MB.');
  }

  const fileName = file.name.toLowerCase();
  let rows: CruiseDayValues[];

  if (fileName.endsWith('.xlsx')) {
    rows = await parseCruiseDayDetailsFromXlsx(file);
  } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    rows = parseCruiseDayDetailsFromCsv(await file.text());
  } else {
    throw new Error('Nieobsługiwany format pliku. Użyj plików CSV lub XLSX.');
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    throw new Error(`Plik zawiera zbyt wiele wierszy. Maksymalna liczba to ${MAX_IMPORT_ROWS}.`);
  }

  return rows;
}

function parsePositionString(position: string): {
  latDd: string;
  latMm: string;
  latDir: string;
  lonDd: string;
  lonMm: string;
  lonDir: string;
  pointName: string;
} {
  const result = {
    latDd: '',
    latMm: '',
    latDir: '',
    lonDd: '',
    lonMm: '',
    lonDir: '',
    pointName: '',
  };

  if (!position) return result;

  const parts = position.split(' - ');
  if (!/^\s*-?\d+(?:[.,]\d+)?\s+\d+(?:[.,]\d+)?\s+[NSEW]\b/i.test(parts[0])) {
    result.pointName = position.trim();
    return result;
  }
  const coordinatesPart = parts[0];
  result.pointName = parts.slice(1).join(' - ').trim();

  const coordParts = coordinatesPart.split(',');
  if (coordParts.length >= 1) {
    const latParts = coordParts[0].trim().split(/\s+/);
    result.latDd = latParts[0] || '';
    result.latMm = latParts[1] || '';
    result.latDir = latParts[2] || '';
  }

  if (coordParts.length >= 2) {
    const lonParts = coordParts[1].trim().split(/\s+/);
    result.lonDd = lonParts[0] || '';
    result.lonMm = lonParts[1] || '';
    result.lonDir = lonParts[2] || '';
  }

  return result;
}

export async function exportCruiseDayDetailsToXlsx(
  data: CruiseDayValues[],
  fileName: string = 'rejsu-dane.xlsx'
): Promise<void> {
  try {
    const headers = ['LAT', '', '', 'LONG', '', '', 'Nazwa Punktu'];

    const exportRows = data.map((row) => {
      const position = parsePositionString(row.position);
      return [
        position.latDd,
        position.latMm,
        position.latDir,
        position.lonDd,
        position.lonMm,
        position.lonDir,
        position.pointName,
      ];
    });

    const allData = [headers, ...exportRows];

    await writeXlsxFile(allData, { sheet: 'Dane' }).toFile(fileName);
    toast.success(`Plik ${fileName} został pobierany`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    toast.error(`Błąd podczas eksportowania do XLSX: ${errorMessage}`);
    console.error('XLSX Export Error:', error);
  }
}
