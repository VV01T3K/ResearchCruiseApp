import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';

export function CruiseManagerInfoSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { formA, formAInitValues, isReadonly } = context;

  return (
    <AppAccordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault data-testid="form-b-cruise-manager-section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
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
        </div>
        <div>
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
        </div>
        <div className="grid place-items-center">
          <form.AppField name="isCruiseManagerPresent">
            {(field) => (
              <field.CheckboxField size="md" label="Czy kierownik jest obecny na rejsie?" disabled={isReadonly} />
            )}
          </form.AppField>
        </div>
      </div>
    </AppAccordion>
  );
}
