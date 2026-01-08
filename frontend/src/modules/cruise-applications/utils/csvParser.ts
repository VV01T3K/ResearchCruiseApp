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

  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  let headers = parseCSVLine(headerLine, delimiter).map((h) => h.toLowerCase().trim());
  let headerRowIndex = 0;

  let columnIndices: Record<string, number>;
  let foundColumnsCount = 0;
  let latHeaderIndex = -1;
  let lonHeaderIndex = -1;

  do {
    headers = parseCSVLine(lines[headerRowIndex], delimiter).map((h) => h.toLowerCase().trim());

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

  const rows: CruiseDayDetailsDto[] = [];

  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    const values = parseCSVLine(line, delimiter);

    let positionString = '';
    if (columnIndices.latDd !== -1 && columnIndices.latMm !== -1 && columnIndices.latDir !== -1) {
      const latDd = String(values[columnIndices.latDd] || '').trim();
      const latMm = String(values[columnIndices.latMm] || '').trim();
      const latDir = String(values[columnIndices.latDir] || '').trim();
      positionString = `${latDd} ${latMm} ${latDir},`;
    }

    if (columnIndices.lonDd !== -1 && columnIndices.lonMm !== -1 && columnIndices.lonDir !== -1) {
      const lonDd = String(values[columnIndices.lonDd] || '').trim();
      const lonMm = String(values[columnIndices.lonMm] || '').trim();
      const lonDir = String(values[columnIndices.lonDir] || '').trim();
      if (positionString) {
        positionString += ` ${lonDd} ${lonMm} ${lonDir}`;
      } else {
        positionString = `${lonDd} ${lonMm} ${lonDir}`;
      }
    }

    if (columnIndices.pointName !== -1) {
      const pointName = String(values[columnIndices.pointName] || '').trim();
      if (pointName) {
        if (positionString) {
          positionString += ` - ${pointName}`;
        } else {
          positionString = pointName;
        }
      }
    }

    const row: CruiseDayDetailsDto = {
      number: String(values[columnIndices.number] || '0').trim(),
      hours: String(values[columnIndices.hours] || '0').trim(),
      taskName: String(values[columnIndices.taskName] || '').trim(),
      region: String(values[columnIndices.region] || '').trim(),
      position: positionString,
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
        let latHeaderIndex = -1;
        let lonHeaderIndex = -1;

        do {
          headers = (data[headerRowIndex] as unknown as string[]).map((h) => String(h).toLowerCase().trim());

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
          reject(
            new Error(
              'Jeśli jedna z kolumn Latitude(LAT), longitude(LONG) lub "Nazwa Punktu" jest obecna, wszystkie trzy muszą być obecne'
            )
          );
          return;
        }

        const rows: CruiseDayDetailsDto[] = [];

        for (let i = headerRowIndex + 1; i < data.length; i++) {
          const row = data[i] as unknown as unknown[];

          if (!row || row.length === 0 || row.every((cell) => !cell)) {
            continue;
          }

          let positionString = '';
          if (columnIndices.latDd !== -1 && columnIndices.latMm !== -1 && columnIndices.latDir !== -1) {
            const latDd = String(row[columnIndices.latDd] || '').trim();
            const latMm = String(row[columnIndices.latMm] || '').trim();
            const latDir = String(row[columnIndices.latDir] || '').trim();
            positionString = `${latDd} ${latMm} ${latDir},`;
          }

          if (columnIndices.lonDd !== -1 && columnIndices.lonMm !== -1 && columnIndices.lonDir !== -1) {
            const lonDd = String(row[columnIndices.lonDd] || '').trim();
            const lonMm = String(row[columnIndices.lonMm] || '').trim();
            const lonDir = String(row[columnIndices.lonDir] || '').trim();
            if (positionString) {
              positionString += ` ${lonDd} ${lonMm} ${lonDir}`;
            } else {
              positionString = `${lonDd} ${lonMm} ${lonDir}`;
            }
          }

          if (columnIndices.pointName !== -1) {
            const pointName = String(row[columnIndices.pointName] || '').trim();
            if (pointName) {
              if (positionString) {
                positionString += ` - ${pointName}`;
              } else {
                positionString = pointName;
              }
            }
          }

          const cruiseDay: CruiseDayDetailsDto = {
            number: String(row[columnIndices.number] || '0').trim(),
            hours: String(row[columnIndices.hours] || '0').trim(),
            taskName: String(row[columnIndices.taskName] || '').trim(),
            region: String(row[columnIndices.region] || '').trim(),
            position: positionString,
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
  const coordinatesPart = parts[0];
  result.pointName = parts[1] ? parts[1].trim() : '';

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

/**
 * Exports CruiseDayDetailsDto array to XLSX file and triggers download
 */
export function exportCruiseDayDetailsToXlsx(data: CruiseDayDetailsDto[], fileName: string = 'rejsu-dane.xlsx'): void {
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

    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dane');

    XLSX.writeFile(workbook, fileName);
    toast.success(`Plik ${fileName} został pobierany`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    toast.error(`Błąd podczas eksportowania do XLSX: ${errorMessage}`);
    console.error('XLSX Export Error:', error);
  }
}
