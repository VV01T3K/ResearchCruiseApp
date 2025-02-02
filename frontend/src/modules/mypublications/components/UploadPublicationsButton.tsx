import Papa from 'papaparse';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { Publication } from '@/mypublications/models/Publication';

function parseRow(row: Record<string, string>) {
  return {
    category: 'subject',
    doi: row['Numer DOI'] !== '' ? row['Numer DOI'] : '-',
    authors: row['Autorzy'] !== '' ? row['Autorzy'] : '-',
    title: row['Tytuł publikacji'] !== '' ? row['Tytuł publikacji'] : '-',
    magazine: row['Nazwa czasopisma'] !== '' ? row['Nazwa czasopisma'] : '-',
    year: row['Rok'] !== '' ? row['Rok'] : '-',
    ministerialPoints: row['Punkty'] !== '' ? row['Punkty'] : '-',
  };
}

type Props = {
  onUpload: (publications: Publication[]) => void;
};
export function UploadPublicationsButton({ onUpload }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const decoder = new TextDecoder('windows-1250');
      const csvText = decoder.decode(event.target?.result as ArrayBuffer);

      Papa.parse(csvText, {
        delimiter: ';',
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Record<string, string>[] }) => {
          const publications = results.data.map(parseRow);
          onUpload(publications as Publication[]);
        },
      });
    };
    reader.readAsArrayBuffer(file);

    inputRef.current!.value = '';
  }

  return (
    <>
      <input type="file" ref={inputRef} multiple={true} className="hidden" onChange={handleFileChange} />
      <AppButton onClick={() => inputRef.current?.click()}>Import publikacji z pliku CSV</AppButton>
    </>
  );
}
