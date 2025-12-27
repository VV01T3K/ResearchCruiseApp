import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { CruiseDayDetailsDto } from '@/cruise-applications/models/CruiseDayDetailsDto';

/**
 * Parses a CSV string and converts it to an array of CruiseDayDetailsDto objects
 * Expected CSV columns: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi etc
 * The columns can't contain the polish letters like 'ń'
 * Supports both comma and semicolon as delimiters
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export function parseCruiseDayDetailsFromCsv(csvContent: string): CruiseDayDetailsDto[] {
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('Plik CSV musi zawierać wiersz nagłówka i przynajmniej jeden wiersz danych');
  }

  // Detect delimiter (comma or semicolon)
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  // Parse header
  let headers = parseCSVLine(headerLine, delimiter).map((h) => h.toLowerCase().trim());
  let headerRowIndex = 0;

  // Helper function to find column index by multiple possible names
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

  do {
    headers = parseCSVLine(lines[headerRowIndex], delimiter).map((h) => h.toLowerCase().trim());

    columnIndices = {
      number: findColumnIndex(['number', 'day', 'dzien', 'dd']),
      hours: findColumnIndex(['hours', 'godziny', 'liczba godzin', 'mm.mmm']),
      taskName: findColumnIndex(['taskname', 'task name', 'zadanie', 'nazwa zadania', 'nazwa_zadania', 'n', 'e']),
      region: findColumnIndex(['region', 'rejon', 'rejon zadania', 'rejon_zadania']),
      position: findColumnIndex(['position', 'pozycja', 'nazwa punktu']),
      comment: findColumnIndex(['comment', 'uwagi', 'remarks', 'notatki']),
    };

    foundColumnsCount = Object.values(columnIndices).filter((index) => index !== -1).length;

    headerRowIndex++;
  } while (foundColumnsCount === 0 && headerRowIndex < lines.length);
  headerRowIndex--;
  // Log missing columns as warnings instead of throwing errors
  const missingColumns = Object.entries(columnIndices)
    .filter(([, index]) => index === -1)
    .map(([key]) => key);

  const polishNames: Record<string, string> = {
    number: 'dzień',
    hours: 'godziny',
    taskName: 'nazwa zadania',
    region: 'rejon',
    position: 'pozycja',
    comment: 'uwagi',
  };

  if (missingColumns.length > 0) {
    const translatedMissing = missingColumns.map((key) => polishNames[key] || key).join(', ');
    toast(`Plik CSV nie zawiera kolumn: ${translatedMissing}. Zostaną one wypełnione pustymi wartościami.`);
  }

  const rows: CruiseDayDetailsDto[] = [];

  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    const values = parseCSVLine(line, delimiter);

    const row: CruiseDayDetailsDto = {
      number: String(values[columnIndices.number] || '0').trim(),
      hours: String(values[columnIndices.hours] || '0').trim(),
      taskName: String(values[columnIndices.taskName] || '').trim(),
      region: String(values[columnIndices.region] || '').trim(),
      position: String(values[columnIndices.position] || '').trim(),
      comment: String(values[columnIndices.comment] || '').trim(),
    };

    rows.push(row);
  }

  if (rows.length === 0) {
    throw new Error('Plik CSV nie zawiera wierszy danych');
  }

  return rows;
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);

  return result;
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Nie udało się odczytać pliku jako tekst'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać pliku'));
    };
    reader.readAsText(file);
  });
}
/**
 * Parses an XLSX file and converts it to an array of CruiseDayDetailsDto objects
 * Supports the same columns as CSV: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export async function parseCruiseDayDetailsFromXlsx(file: File): Promise<CruiseDayDetailsDto[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (!content) {
          reject(new Error('Nie udało się odczytać pliku'));
          return;
        }

        const workbook = XLSX.read(content, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          reject(new Error('Plik XLSX nie zawiera arkuszy'));
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { header: 1 });

        if (data.length < 2) {
          reject(new Error('Plik XLSX musi zawierać wiersz nagłówka i przynajmniej jeden wiersz danych'));
          return;
        }

        let headers = (data[0] as unknown as string[]).map((h) => String(h).toLowerCase().trim());
        let headerRowIndex = 0;

        // Helper function to find column index by multiple possible names
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

        do {
          headers = (data[headerRowIndex] as unknown as string[]).map((h) => String(h).toLowerCase().trim());

          columnIndices = {
            number: findColumnIndex(['number', 'day', 'dzien', 'dd']),
            hours: findColumnIndex(['hours', 'godziny', 'liczba godzin', 'mm.mmm']),
            taskName: findColumnIndex(['taskname', 'task name', 'zadanie', 'nazwa zadania', 'nazwa_zadania', 'n']),
            region: findColumnIndex(['region', 'rejon', 'rejon zadania', 'rejon_zadania']),
            position: findColumnIndex(['position', 'pozycja', 'nazwa punktu']),
            comment: findColumnIndex(['comment', 'uwagi', 'remarks', 'notatki']),
          };

          foundColumnsCount = Object.values(columnIndices).filter((index) => index !== -1).length;

          headerRowIndex++;
        } while (foundColumnsCount === 0 && headerRowIndex < data.length);
        headerRowIndex--;

        const missingColumns = Object.entries(columnIndices)
          .filter(([, index]) => index === -1)
          .map(([key]) => key);

        const polishNames: Record<string, string> = {
          number: 'dzień',
          hours: 'godziny',
          taskName: 'nazwa zadania',
          region: 'rejon',
          position: 'pozycja',
          comment: 'uwagi',
        };

        if (missingColumns.length > 0) {
          const translatedMissing = missingColumns.map((key) => polishNames[key] || key).join(', ');
          toast(`Plik XLSX nie zawiera kolumn: ${translatedMissing}. Zostaną one wypełnione pustymi wartościami.`);
        }

        const rows: CruiseDayDetailsDto[] = [];

        for (let i = headerRowIndex + 1; i < data.length; i++) {
          const row = data[i] as unknown as unknown[];

          // Skip empty rows
          if (!row || row.length === 0 || row.every((cell) => !cell)) {
            continue;
          }

          const cruiseDay: CruiseDayDetailsDto = {
            number: String(row[columnIndices.number] || '0').trim(),
            hours: String(row[columnIndices.hours] || '0').trim(),
            taskName: String(row[columnIndices.taskName] || '').trim(),
            region: String(row[columnIndices.region] || '').trim(),
            position: String(row[columnIndices.position] || '').trim(),
            comment: String(row[columnIndices.comment] || '').trim(),
          };

          rows.push(cruiseDay);
        }

        if (rows.length === 0) {
          reject(new Error('Plik XLSX nie zawiera wierszy danych'));
          return;
        }

        resolve(rows);
      } catch (error) {
        reject(
          new Error(
            `Nie udało się przeanalizować pliku XLSX: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
          )
        );
      }
    };
    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać pliku'));
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses either CSV or XLSX file based on file extension
 * Missing columns will be filled with empty strings instead of throwing an error
 */
export async function parseCruiseDayDetailsFromFile(file: File): Promise<CruiseDayDetailsDto[]> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return parseCruiseDayDetailsFromXlsx(file);
  }

  if (fileName.endsWith('.csv')) {
    const csvContent = await readFileAsText(file);
    return parseCruiseDayDetailsFromCsv(csvContent);
  }

  throw new Error('Nieobsługiwany format pliku. Użyj plików CSV lub XLSX.');
}
