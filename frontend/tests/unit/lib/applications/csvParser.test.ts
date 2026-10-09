import { describe, expect, it } from 'vitest';
import writeXlsxFile from 'write-excel-file/node';

import { parseCruiseDayDetailsFromFile, parseCruiseDayDetailsFromXlsx } from '@/lib/applications/csvParser';

async function xlsxFile(rows: (string | number | null)[][]): Promise<File> {
  const buffer = await writeXlsxFile(rows).toBuffer();
  return new File([new Uint8Array(buffer)], 'cruise-days.xlsx');
}

describe('parseCruiseDayDetailsFromXlsx', () => {
  it('reads cruise days from the first sheet', async () => {
    const file = await xlsxFile([
      ['Dzien', 'Godziny', 'Zadanie', 'Rejon', 'Uwagi'],
      [1, 12, 'Pomiary CTD', 'Głębia Gdańska', 'Brak'],
      [null, null, null, null, null],
      [2, 6.5, 'Połów', 'Rynna Słupska', null],
    ]);

    await expect(parseCruiseDayDetailsFromXlsx(file)).resolves.toEqual([
      { number: 1, hours: 12, taskName: 'Pomiary CTD', region: 'Głębia Gdańska', position: '', comment: 'Brak' },
      { number: 2, hours: 6.5, taskName: 'Połów', region: 'Rynna Słupska', position: '', comment: '' },
    ]);
  });

  it('reads positions in the exported layout', async () => {
    const file = await xlsxFile([
      ['LAT', '', '', 'LONG', '', '', 'Nazwa Punktu'],
      ['54', '30.5', 'N', '18', '45.2', 'E', 'P1'],
    ]);

    const [row] = await parseCruiseDayDetailsFromXlsx(file);

    expect(row.position).toBe('54 30.5 N, 18 45.2 E - P1');
  });

  it('rejects files that are not spreadsheets', async () => {
    const file = new File(['not a spreadsheet'], 'broken.xlsx');

    await expect(parseCruiseDayDetailsFromXlsx(file)).rejects.toThrow('Nie udało się przeanalizować pliku XLSX');
  });
});

describe('parseCruiseDayDetailsFromFile', () => {
  it.each(['dni.csv', 'dni.txt'])('reads %s as CSV text', async (name) => {
    const file = new File(['Dzien;Godziny;Zadanie\n1;12;Pomiary CTD'], name);

    await expect(parseCruiseDayDetailsFromFile(file)).resolves.toMatchObject([
      { number: 1, hours: 12, taskName: 'Pomiary CTD' },
    ]);
  });

  it('rejects other formats instead of reading them as CSV', async () => {
    const file = new File(['binary'], 'dni.xls');

    await expect(parseCruiseDayDetailsFromFile(file)).rejects.toThrow('Nieobsługiwany format pliku');
  });
});
