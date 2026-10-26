import { describe, expect, it } from 'vite-plus/test';

import { parsePublicationCsv, PublicationCsvError, readPublicationCsv } from '@/lib/publications/publicationCsv';

const HEADER = 'Numer DOI;Autorzy;Tytuł publikacji;Nazwa czasopisma;Rok;Punkty';
const CSV = `${HEADER}\r\n10.1234/qa;Łódź Żak;"Bałtyk; łódź";Przegląd;2026;140\r\n`;

// Windows-1250 bytes for the non-ASCII characters in CSV.
const CP1250: Record<string, number> = { ł: 0xb3, Ł: 0xa3, ó: 0xf3, ź: 0x9f, Ż: 0xaf, ą: 0xb9 };
const utf8 = new TextEncoder().encode(CSV);

describe('readPublicationCsv', () => {
  it.each([
    ['UTF-8', utf8],
    ['UTF-8 with BOM', Uint8Array.from([0xef, 0xbb, 0xbf, ...utf8])],
    ['Windows-1250', Uint8Array.from(CSV, (char) => CP1250[char] ?? char.charCodeAt(0))],
  ])('keeps Polish text and the title from %s files', async (_, bytes) => {
    await expect(readPublicationCsv(new Blob([bytes]))).resolves.toEqual([
      {
        category: 'subject',
        doi: '10.1234/qa',
        authors: 'Łódź Żak',
        title: 'Bałtyk; łódź',
        magazine: 'Przegląd',
        year: '2026',
        ministerialPoints: '140',
      },
    ]);
  });
});

describe('parsePublicationCsv', () => {
  it('replaces blank cells with a dash and ignores blank lines', () => {
    expect(parsePublicationCsv(`${HEADER}\n;Autor; ;;2026;140\n\n;;;;;\n`)).toEqual([
      {
        category: 'subject',
        doi: '-',
        authors: 'Autor',
        title: '-',
        magazine: '-',
        year: '2026',
        ministerialPoints: '140',
      },
    ]);
  });

  it.each([
    ['missing columns', 'Numer DOI,Autorzy\n1,A', 'brakuje kolumn oddzielonych średnikiem: „Numer DOI”'],
    ['no publications', `${HEADER}\n`, 'nie zawiera żadnych publikacji'],
    [
      'a short row after blank lines and multi-line values',
      `${HEADER}\n\n1;A;"T\nT";M;2026;5\n\n2;B;T`,
      'Nie udało się odczytać publikacji nr 2 z pliku CSV.',
    ],
    ['an unclosed quote', `${HEADER}\n1;A;"T;M;2026;5`, 'Sprawdź liczbę kolumn i zamknięcie cudzysłowów.'],
    [
      'points over the score-safe bound',
      `${HEADER}\n1;A;T;M;2026;5\n2;B;T;M;2026;2147483648`,
      'Publikacja nr 2: Punkty',
    ],
  ])('rejects %s', (_, csv, message) => {
    expect(() => parsePublicationCsv(csv)).toThrow(PublicationCsvError);
    expect(() => parsePublicationCsv(csv)).toThrow(message);
  });
});
