import { Accordion } from '@/components/shared/Accordion';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';

export function CruiseManagerInfoSection({ context }: { context: FormCViewModel }) {
  const { formA, formAInitValues } = context;

  return (
    <Accordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DropdownInput
          name="cruiseManager"
          value={formA.cruiseManagerId}
          allOptions={formAInitValues.cruiseManagers.map((person) => ({
            inlineLabel: mapPersonToText(person),
            value: person.id,
          }))}
          label="Kierownik rejsu"
          disabled
        />
        <DropdownInput
          name="deputyManager"
          value={formA.deputyManagerId}
          allOptions={formAInitValues.deputyManagers.map((person) => ({
            inlineLabel: mapPersonToText(person),
            value: person.id,
          }))}
          label="Zastępca kierownika rejsu"
          disabled
        />
        <DropdownInput
          name="Rok"
          value={formA.year}
          label="Rok"
          placeholder="Wybierz rok"
          allOptions={formAInitValues.years.map((year) => ({
            value: year,
            inlineLabel: year,
          }))}
          disabled
        />
      </div>
    </Accordion>
  );
}
