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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseBibTeX(_bibTexText: string): Publication[] {
  // TODO: Implement BibTeX parsing
  console.warn('BibTeX parsing not yet implemented');
  return [];
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
      reader.onload = (evt) => {
        try {
          const bibTexText = new TextDecoder('utf-8').decode(evt.target?.result as ArrayBuffer);
          resolve(parseBibTeX(bibTexText));
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
        accept=".csv,.bib"
      />
      <AppButton onClick={() => inputRef.current?.click()}>Import publikacji z pliku CSV</AppButton>
    </>
  );
}
