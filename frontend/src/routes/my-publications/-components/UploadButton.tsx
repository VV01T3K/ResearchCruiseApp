import { CircleNotchIcon } from '@phosphor-icons/react';
import React from 'react';

import { Button } from '@/components/shared/Button';
import { toast } from '@/components/shared/layout/toast';
import type { ImportPublicationRequest } from '@/api/generated/schemas';
import { PublicationCsvError, readPublicationCsv } from '@/lib/publications/publicationCsv';

type Props = {
  onUpload: (publications: ImportPublicationRequest[]) => void;
  isImporting: boolean;
};
export function UploadButton({ onUpload, isImporting }: Props) {
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
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={() => void handleFileChange()}
        accept=".csv,text/csv"
      />
      <Button onClick={() => inputRef.current?.click()} disabled={isImporting}>
        {isImporting ? (
          <>
            <CircleNotchIcon className="h-4 w-4 animate-spin" />
            Importowanie publikacji…
          </>
        ) : (
          'Import publikacji z pliku CSV'
        )}
      </Button>
    </>
  );
}
