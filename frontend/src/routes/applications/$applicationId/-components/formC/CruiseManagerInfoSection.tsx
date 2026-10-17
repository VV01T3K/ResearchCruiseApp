import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';

export function CruiseManagerInfoSection({ context }: { context: FormCViewModel }) {
  const { formA, formAInitValues } = context;

  return (
    <AppAccordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault data-testid="form-c-cruise-manager-section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AppDropdownInput
          name="cruiseManager"
          value={formA.cruiseManagerId}
          allOptions={formAInitValues.cruiseManagers.map((person) => ({
            inlineLabel: mapPersonToText(person),
            value: person.id,
          }))}
          label="Kierownik rejsu"
          disabled
        />
        <AppDropdownInput
          name="deputyManager"
          value={formA.deputyManagerId}
          allOptions={formAInitValues.deputyManagers.map((person) => ({
            inlineLabel: mapPersonToText(person),
            value: person.id,
          }))}
          label="Zastępca kierownika rejsu"
          disabled
        />
        <AppDropdownInput
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
    </AppAccordion>
  );
}
