import { describe, expect, it } from 'vitest';
import writeXlsxFile from 'write-excel-file/node';

import { parseCruiseDayDetailsFromXlsx } from './csvParser';

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
