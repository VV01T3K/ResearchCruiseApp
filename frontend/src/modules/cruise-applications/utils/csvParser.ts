import { CruiseDayDetailsDto } from '@/cruise-applications/models/CruiseDayDetailsDto';

/**
 * Parses a CSV string and converts it to an array of CruiseDayDetailsDto objects
 * Expected CSV columns: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi etc
 * The columns can't contain the polish letters like 'ń'
 * Supports both comma and semicolon as delimiters
 */
export function parseCruiseDayDetailsFromCsv(csvContent: string): CruiseDayDetailsDto[] {
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('CSV file must contain header row and at least one data row');
  }

  // Detect delimiter (comma or semicolon)
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  // Parse header
  const headers = parseCSVLine(headerLine, delimiter).map((h) => h.toLowerCase().trim());

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

  // Find column indices with support for Polish and English variants
  const columnIndices = {
    number: findColumnIndex(['number', 'day', 'dzien']),
    hours: findColumnIndex(['hours', 'godziny', 'liczba godzin']),
    taskName: findColumnIndex(['taskname', 'task name', 'task_name', 'zadanie', 'nazwa zadania', 'nazwa_zadania']),
    region: findColumnIndex(['region', 'rejon', 'rejon zadania', 'rejon_zadania']),
    position: findColumnIndex(['position', 'pozycja', 'stanowisko']),
    comment: findColumnIndex(['comment', 'uwagi', 'remarks', 'notatki']),
  };

  // Validate that we found the required columns
  const missingColumns = Object.entries(columnIndices)
    .filter(([, index]) => index === -1)
    .map(([key]) => key);

  if (missingColumns.length > 0) {
    throw new Error(
      `CSV file is missing required columns: ${missingColumns.join(', ')}. Expected columns: number/day/dzien, hours/godziny/liczba godzin, taskName/task name/nazwa zadania/zadanie, region/rejon, position/pozycja, comment/uwagi`
    );
  }

  const rows: CruiseDayDetailsDto[] = [];

  for (let i = 1; i < lines.length; i++) {
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
    throw new Error('CSV file contains no data rows');
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
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}
