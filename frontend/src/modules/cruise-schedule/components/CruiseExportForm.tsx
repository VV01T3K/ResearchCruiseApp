import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { FileDto } from '@/cruise-applications/models/FileDto';
import { useCruiseCsvExportMutation } from '@/cruise-schedule/hooks/CruisesApiHooks';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';

type Props = {
  cruises: CruiseDto[];

  onDone?: () => void;
};
export function CruiseExportForm({ cruises, onDone }: Props) {
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
  const cruiseCsvExportMutation = useCruiseCsvExportMutation(handleExportedFile);

  function handleExportedFile(file: FileDto) {
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
