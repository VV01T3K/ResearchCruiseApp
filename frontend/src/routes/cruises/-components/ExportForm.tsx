import React from 'react';
import { useMutation } from '@tanstack/react-query';

import { AppButton } from '@/components/shared/AppButton';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { exportCruises } from '@/api/generated/endpoints/cruises.gen';
import type { CruiseResponse, ExportResponse } from '@/api/generated/schemas';

type Props = {
  cruises: CruiseResponse[];

  onDone?: () => void;
};
export function ExportForm({ cruises, onDone }: Props) {
  const possibleYears = React.useMemo(() => {
    return cruises
      .reduce((acc, cruise) => {
        const year = new Date(cruise.startDate).getFullYear().toString();
        if (!acc.includes(year)) {
          acc.push(year);
        }
        return acc;
      }, [] as string[])
      .sort((a, b) => parseInt(b) - parseInt(a));
  }, [cruises]);

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = React.useState<string>(
    possibleYears.includes(currentYear) ? currentYear : (possibleYears[0] ?? '')
  );

  const anchorRef = React.useRef<HTMLAnchorElement>(null);
  const cruiseCsvExportMutation = useMutation({
    mutationFn: (year: string) => exportCruises({ year }),
    onSuccess: handleExportedFile,
  });

  function handleExportedFile(file: ExportResponse) {
    anchorRef.current?.setAttribute('href', file.content);
    anchorRef.current?.setAttribute('download', file.name);
    anchorRef.current?.click();
    onDone?.();
  }

  if (possibleYears.length === 0) {
    return 'Brak rejsów możliwych do wyeksportowania';
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <AppDropdownInput
          label="Wybierz rok, dla którego chcesz wyeksportować rejsy"
          name="year"
          allOptions={possibleYears.map((year) => ({ value: year, inlineLabel: year }))}
          value={selectedYear.toString()}
          onChange={(year) => setSelectedYear(year)}
        />
        <AppButton variant="primary" onClick={() => cruiseCsvExportMutation.mutate(selectedYear)}>
          Eksportuj rejsy z roku {selectedYear} do pliku CSV
        </AppButton>
      </div>
      <a className="hidden" ref={anchorRef} />
    </>
  );
}
