import React from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import type { ImportPublicationRequest } from '@/api/generated/schemas';
import { PublicationCsvError, readPublicationCsv } from '@/lib/publications/publicationCsv';

type Props = {
  onUpload: (publications: ImportPublicationRequest[]) => void;
};
export function UploadButton({ onUpload }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileChange() {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!input || !file) {
      return;
    }
    input.value = '';

    try {
      onUpload(await readPublicationCsv(file));
    } catch (error) {
      toast.error(
        error instanceof PublicationCsvError
          ? `Nie zaimportowano publikacji. ${error.message}`
          : 'Nie udało się odczytać pliku CSV.'
      );
    }
  }

  return (
    <>
      <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept=".csv,text/csv" />
      <AppButton onClick={() => inputRef.current?.click()}>Import publikacji z pliku CSV</AppButton>
    </>
  );
}
