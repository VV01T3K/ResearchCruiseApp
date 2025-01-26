import { AppButton } from '@core/components';
import { Publication } from '@core/models';
import Papa from 'papaparse';
import { useRef } from 'react';

export function UploadFileButton({ onUpload }: { onUpload: (publications: Publication[]) => void }) {
  const fileUploadRef = useRef<HTMLInputElement>(null);

  function handleFileChange() {
    const file = fileUploadRef.current?.files?.[0];
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

    fileUploadRef.current!.value = '';
  }

  return (
    <>
      <input type="file" ref={fileUploadRef} multiple={true} className="hidden" onChange={handleFileChange} />
      <AppButton onClick={() => fileUploadRef.current?.click()}>Import publikacji z pliku CSV</AppButton>
    </>
  );
}

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
