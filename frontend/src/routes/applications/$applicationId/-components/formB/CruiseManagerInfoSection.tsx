import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { withForm } from '@/lib/form';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';

export const CruiseManagerInfoSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function CruiseManagerInfoSection({ form, context }) {
    const { formA, formAInitValues, isReadonly } = context;

    return (
      <AppAccordion
        title="2. Kierownik zgłaszanego rejsu"
        expandedByDefault
        data-testid="form-b-cruise-manager-section"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
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
          </div>
          <div>
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
          </div>
          <div className="grid place-items-center">
            <form.AppField
              name="isCruiseManagerPresent"
              children={(field) => (
                <field.CheckboxField size="md" label="Czy kierownik jest obecny na rejsie?" disabled={isReadonly} />
              )}
            />
          </div>
        </div>
      </AppAccordion>
    );
  },
});
