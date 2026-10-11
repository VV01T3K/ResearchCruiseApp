import { describe, expect, it } from 'vitest';

import {
  decodePublicationCsv,
  parsePublicationCsv,
  PublicationCsvError,
  readPublicationCsv,
} from '@/lib/publications/publicationCsv';

const HEADER = 'Numer DOI;Autorzy;Tytuł publikacji;Nazwa czasopisma;Rok;Punkty';
const ROW = '10.1234/qa-oct11;Żółć Łódź;Zażółć gęślą jaźń – badania Bałtyku;Przegląd badań;2026;140';
const CSV = `${HEADER}\r\n${ROW}\r\n`;

const EXPECTED = {
  category: 'subject',
  doi: '10.1234/qa-oct11',
  authors: 'Żółć Łódź',
  title: 'Zażółć gęślą jaźń – badania Bałtyku',
  magazine: 'Przegląd badań',
  year: '2026',
  ministerialPoints: '140',
};

// Windows-1250 code points for the Polish characters used in the fixture.
const CP1250: Record<string, number> = {
  ą: 0xb9,
  ć: 0xe6,
  ę: 0xea,
  ł: 0xb3,
  ń: 0xf1,
  ó: 0xf3,
  ś: 0x9c,
  ź: 0x9f,
  ż: 0xbf,
  Ą: 0xa5,
  Ć: 0xc6,
  Ę: 0xca,
  Ł: 0xa3,
  Ń: 0xd1,
  Ó: 0xd3,
  Ś: 0x8c,
  Ź: 0x8f,
  Ż: 0xaf,
  '–': 0x96,
};

function encodeWindows1250(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(text, (char) => {
    const byte = CP1250[char] ?? char.charCodeAt(0);
    if (byte > 0xff) throw new Error(`No Windows-1250 byte for ${char}`);
    return byte;
  });
}

function utf8(text: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(text);
}

function withBom(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  return Uint8Array.from([0xef, 0xbb, 0xbf, ...bytes]);
}

describe('readPublicationCsv', () => {
  it.each([
    ['UTF-8', utf8(CSV)],
    ['UTF-8 with BOM', withBom(utf8(CSV))],
    ['legacy Windows-1250', encodeWindows1250(CSV)],
  ])('keeps Polish text and the title from %s files', async (_, bytes) => {
    await expect(readPublicationCsv(new Blob([bytes]))).resolves.toEqual([EXPECTED]);
  });

  it('reads quoted titles containing the delimiter from UTF-8 files with BOM', async () => {
    const csv = `${HEADER}\n10.1234/qa;Żółć Łódź;"Bałtyk; badania";Przegląd badań;2026;140\n`;

    const [publication] = await readPublicationCsv(new Blob([withBom(utf8(csv))]));

    expect(publication).toMatchObject({ doi: '10.1234/qa', title: 'Bałtyk; badania' });
  });
});

describe('decodePublicationCsv', () => {
  it('rejects binary files', () => {
    expect(() => decodePublicationCsv(Uint8Array.from([0x50, 0x4b, 0x03, 0x04, 0x00]))).toThrow(
      'nie jest plikiem tekstowym CSV'
    );
  });
});

describe('parsePublicationCsv', () => {
  it('replaces blank cells with a dash and ignores blank lines', () => {
    const [publication] = parsePublicationCsv(`${HEADER}\n;Autor; ;;2026;140\n\n;;;;;\n`);

    expect(publication).toEqual({
      category: 'subject',
      doi: '-',
      authors: 'Autor',
      title: '-',
      magazine: '-',
      year: '2026',
      ministerialPoints: '140',
    });
  });

  it.each([
    ['empty files', '', 'Plik CSV jest pusty.'],
    [
      'missing columns',
      'Numer DOI;Autorzy;Rok\n1;A;2026',
      'brakuje kolumn: „Tytuł publikacji”, „Nazwa czasopisma”, „Punkty”',
    ],
    ['comma separated files', HEADER.replaceAll(';', ',') + '\n', 'Kolumny muszą być oddzielone średnikiem (;).'],
    ['files without publications', `${HEADER}\n`, 'Plik CSV nie zawiera żadnych publikacji.'],
    [
      'rows with too few columns',
      `${HEADER}\n${ROW}\n10.1/x;A;T`,
      'Niepoprawna liczba kolumn w wierszu 3 pliku CSV (oczekiwano 6).',
    ],
    [
      'rows with too many columns',
      `${HEADER}\n${ROW};extra`,
      'Niepoprawna liczba kolumn w wierszu 2 pliku CSV (oczekiwano 6).',
    ],
    ['unclosed quotes', `${HEADER}\n10.1/x;A;"Tytuł;M;2026;140`, 'Niezamknięty cudzysłów w wierszu 2 pliku CSV.'],
    [
      'short rows after blank lines',
      `${HEADER}\n\n;;;;;\n10.1/x;A;T`,
      'Niepoprawna liczba kolumn w wierszu 4 pliku CSV (oczekiwano 6).',
    ],
    [
      'short rows after multi-line quoted values',
      `${HEADER}\r\n10.1/x;A;"Tytuł\r\nw dwóch liniach";M;2026;140\r\n10.1/y;A;T`,
      'Niepoprawna liczba kolumn w wierszu 4 pliku CSV (oczekiwano 6).',
    ],
    [
      'unclosed quotes after blank lines',
      `${HEADER}\n${ROW}\n\n10.1/x;A;"Tytuł;M;2026;140`,
      'Niezamknięty cudzysłów w wierszu 4 pliku CSV.',
    ],
  ])('rejects %s with a readable message', (_, csv, message) => {
    expect(() => parsePublicationCsv(csv)).toThrow(PublicationCsvError);
    expect(() => parsePublicationCsv(csv)).toThrow(message);
  });
});
