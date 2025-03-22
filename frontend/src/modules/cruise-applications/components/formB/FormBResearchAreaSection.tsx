import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

export function FormBResearchAreaSection() {
  const { formA, formAInitValues } = useFormB();

  return (
    <AppAccordion title="5. Rejon prowadzanego badań" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <AppDropdownInput
            name="researchAreaId"
            value={formA.researchAreaId}
            allOptions={formAInitValues.researchAreas.map((researchArea) => ({
              value: researchArea.id,
              inlineLabel: researchArea.name,
            }))}
            label="Rejon prowadzenia badań"
            disabled
          />
        </div>
        <div>
          <AppInput
            name="researchAreaInfo"
            value={formA.researchAreaInfo}
            placeholder="Brak informacji dodatkowych"
            label="Informacje dodatkowe"
            disabled
          />
        </div>
      </div>
    </AppAccordion>
  );
}
