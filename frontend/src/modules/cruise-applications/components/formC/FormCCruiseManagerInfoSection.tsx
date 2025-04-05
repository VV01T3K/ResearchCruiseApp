import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';

export function FormCCruiseManagerInfoSection() {
  const { formA, formAInitValues } = useFormC();

  return (
    <AppAccordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppDropdownInput
          name="cruiseManager"
          value={formA.cruiseManagerId}
          allOptions={formAInitValues.cruiseManagers.map((cruiseManager) => ({
            inlineLabel: `${cruiseManager.firstName} ${cruiseManager.lastName} (${cruiseManager.email})`,
            value: cruiseManager.id,
          }))}
          label="Kierownik rejsu"
          disabled
        />
        <AppDropdownInput
          name="deputyManager"
          value={formA.deputyManagerId}
          allOptions={formAInitValues.deputyManagers.map((deputyManager) => ({
            inlineLabel: `${deputyManager.firstName} ${deputyManager.lastName} (${deputyManager.email})`,
            value: deputyManager.id,
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
