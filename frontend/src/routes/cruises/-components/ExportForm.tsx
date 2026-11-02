import React from 'react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/shared/Button';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { parseCalendarDate } from '@/lib/dateUtils';
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
        const year = parseCalendarDate(cruise.startDate).getFullYear().toString();
        if (!acc.includes(year)) {
          acc.push(year);
        }
        return acc;
      }, [] as string[])
      .sort((a, b) => parseInt(b) - parseInt(a));
  }, [cruises]);

  const [selectedYear, setSelectedYear] = React.useState<string>(() => {
    const currentYear = new Date().getFullYear().toString();
    return possibleYears.includes(currentYear) ? currentYear : (possibleYears[0] ?? '');
  });

  const anchorRef = React.useRef<HTMLAnchorElement>(null);
  const cruiseCsvExportMutation = useMutation({
    mutationFn: (year: string) => exportCruises({ year }),
    onSuccess: handleExportedFile,
    meta: { invalidates: false },
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
        <DropdownInput
          label="Wybierz rok, dla którego chcesz wyeksportować rejsy"
          name="year"
          allOptions={possibleYears.map((year) => ({ value: year, inlineLabel: year }))}
          value={selectedYear.toString()}
          onChange={(year) => setSelectedYear(year)}
        />
        <Button variant="primary" onClick={() => cruiseCsvExportMutation.mutate(selectedYear)}>
          Eksportuj rejsy z roku {selectedYear} do pliku CSV
        </Button>
      </div>
      <a className="hidden" ref={anchorRef} />
    </>
  );
}
