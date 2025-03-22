import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

export function FormBShipUsageSection() {
  const { formA, formAInitValues } = useFormB();

  return (
    <AppAccordion title="3. Sposób wykorzystania statku" expandedByDefault>
      <div className="grid grid-cols-1 gap-4">
        <AppDropdownInput
          name="shipUsage"
          value={formA.shipUsage ?? ''}
          allOptions={formAInitValues?.shipUsages.map((shipUsage, i) => ({
            value: i.toString(),
            inlineLabel: shipUsage,
          }))}
          label="Statek na potrzeby badań będzie wykorzystywany"
          disabled
        />
        {formA.shipUsage === '4' && (
          <AppInput name="differentUsage" value={formA.differentUsage} label="Inny sposób użycia" disabled />
        )}
      </div>
    </AppAccordion>
  );
}
