import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-csl';

import Papa from 'papaparse';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import type { Publication } from '@/mypublications/models/Publication';

function parseCSV(csvText: string): Publication[] {
  const publications: Publication[] = [];

  Papa.parse(csvText, {
    delimiter: ';',
    header: true,
    skipEmptyLines: true,
    complete: (results: { data: Record<string, string>[] }) => {
      results.data.forEach((row) => {
        publications.push({
          category: 'subject',
          doi: row['Numer DOI'] || '-',
          authors: row['Autorzy'] || '-',
          title: row['Tytuł publikacji'] || '-',
          magazine: row['Nazwa czasopisma'] || '-',
          year: row['Rok'] || '-',
          ministerialPoints: row['Punkty'] || '-',
        } as Publication);
      });
    },
  });

  return publications;
}

async function parseBibTeX(bibTexText: string): Promise<Publication[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const module = (await import('@citation-js/core')) as any;
  const { Cite } = module;

  const cite = new Cite(bibTexText);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bibliography: any[] = cite.data || [];

  return bibliography.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entry: any) =>
      ({
        category: 'subject',
        doi: entry.DOI || '-',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authors: entry.author ? entry.author.map((a: any) => `${a.given} ${a.family}`).join(', ') : '-',
        title: entry.title || '-',
        magazine: entry['container-title'] || entry.journal || '-',
        year: entry.issued?.['date-parts']?.[0]?.[0]?.toString() || '-',
        ministerialPoints: '-',
      }) as Publication
  );
}

// Helper function to safely extract text using regex
function extractFromText(text: string, pattern: RegExp, groupIndex = 1): string {
  const match = text.match(pattern);
  return match ? match[groupIndex].trim() : '-';
}

function parseHTML(htmlText: string): Publication[] {
  const publications: Publication[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  // Try to parse as table format first (for HTML exports with tables)
  const tableRows = doc.querySelectorAll('table tbody tr');
  if (tableRows.length > 0) {
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const fullText = row.textContent || '';
        const publication = parsePublicationFromText(fullText);

        // For table format, points are usually in a separate cell (3rd column, index 2)
        if (cells.length >= 3) {
          const pointsText = cells[2]?.textContent?.trim() || '-';
          if (/^\d+$/.test(pointsText)) {
            publication.ministerialPoints = pointsText;
          }
        }

        publications.push(publication);
      }
    });
    return publications;
  }

  // Fall back to list format (for HTML exports with ordered lists)
  const listItems = doc.querySelectorAll('ol > li');
  listItems.forEach((item) => {
    const fullText = item.textContent || '';

    // Extract authors from span elements with proper spacing
    const authorElements = item.querySelectorAll(
      'span.native.author-item, span.first.author-item, span.alien.author-item'
    );
    const authors =
      Array.from(authorElements)
        .map((el) => el.textContent?.trim())
        .filter(Boolean)
        .join(', ') || '-';

    const publication = parsePublicationFromText(fullText);

    // Override authors if we found them in spans (they're usually more reliable)
    if (authors !== '-') {
      publication.authors = authors;
    }

    publications.push(publication);
  });

  return publications;
}

function parsePublicationFromText(text: string): Publication {
  // Extract DOI - matches "DOI:" or "DOI " followed by the identifier
  const doi = extractFromText(text, /DOI[:\s]+([^\s,]+)/, 1);

  // Extract year - 4-digit number
  const year = extractFromText(text, /\b(\d{4})\b/, 1);

  // Extract points - number(s) before "punktów"
  const ministerialPoints = extractFromText(text, /(\d+)\s*punktów/, 1);

  // Extract title - text between colon and first comma after authors
  const title = extractFromText(text, /:\s*(.+?),/, 1);

  // Extract magazine - text between year and DOI/points or end
  let magazine = '-';
  if (year !== '-') {
    // Match from year, skip year itself, then capture text until DOI, punktów, or ISBN, or end
    const magazinePattern = new RegExp(`${year}[,\\s]*(.+?)(?:DOI|punktów|ISBN|$)`, 'i');
    const match = text.match(magazinePattern);
    if (match) {
      magazine = match[1]
        .replace(/[,\s]+$/, '') // Remove trailing punctuation and spaces
        .trim();
    }
  }

  // Extract authors - fallback if not extracted from spans
  let authors = '-';
  const authorsPattern = /^([^:]+):/;
  const authorsMatch = text.match(authorsPattern);
  if (authorsMatch) {
    const rawAuthors = authorsMatch[1].trim();
    // Clean up - remove prefixes like numbers or list markers
    authors = rawAuthors.replace(/^\d+\.\s*/, '').trim() || '-';
  }

  return {
    category: 'subject',
    doi,
    authors,
    title,
    magazine,
    year,
    ministerialPoints,
  } as Publication;
}

async function parsePublicationFile(file: File): Promise<Publication[]> {
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const decoder = new TextDecoder('windows-1250');
          const csvText = decoder.decode(evt.target?.result as ArrayBuffer);
          resolve(parseCSV(csvText));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  if (file.type === 'text/plain' || file.name.endsWith('.bib')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bibTexText = new TextDecoder('utf-8').decode(evt.target?.result as ArrayBuffer);
          const publications = await parseBibTeX(bibTexText);
          resolve(publications);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  if (file.type === 'text/html' || file.name.endsWith('.html')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const htmlText = new TextDecoder('utf-8').decode(evt.target?.result as ArrayBuffer);
          const publications = parseHTML(htmlText);
          resolve(publications);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error(`Unsupported file type: ${file.type || file.name}`);
}

type Props = {
  onUpload: (publications: Publication[]) => void;
};

export function UploadPublicationsButton({ onUpload }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileChange() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      return;
    }

    try {
      const publications = await parsePublicationFile(file);
      onUpload(publications);
    } catch (err) {
      console.error('Failed to parse publications:', err);
    } finally {
      inputRef.current!.value = '';
    }
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        multiple={true}
        className="hidden"
        onChange={handleFileChange}
        accept=".csv,.bib,.html"
      />
      <AppButton onClick={() => inputRef.current?.click()}>Import publikacji z pliku CSV</AppButton>
    </>
  );
}
