import { Accordion } from '@/components/shared/Accordion';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';

export function CruiseManagerInfoSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { formA, formAInitValues, isReadonly } = context;

  return (
    <Accordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
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
        </div>
        <div>
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
        </div>
        <div className="grid place-items-center">
          <form.AppField name="isCruiseManagerPresent">
            {(field) => (
              <field.CheckboxField size="md" label="Czy kierownik jest obecny na rejsie?" disabled={isReadonly} />
            )}
          </form.AppField>
        </div>
      </div>
    </Accordion>
  );
}
