import { Accordion } from '@/components/shared/Accordion';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { Input } from '@/components/shared/inputs/Input';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';

export function ShipUsageSection({ context }: { context: FormBViewModel }) {
  const { formA, formAInitValues } = context;

  return (
    <Accordion title="3. Sposób wykorzystania statku" expandedByDefault>
      <div className="grid grid-cols-1 gap-4">
        <DropdownInput
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
          <Input name="differentUsage" value={formA.differentUsage} label="Inny sposób użycia" disabled />
        )}
      </div>
    </Accordion>
  );
}
