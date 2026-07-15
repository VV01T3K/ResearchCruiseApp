import { AppAccordion } from '@/components/shared/AppAccordion';
import { withForm } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapPersonToLabel } from '@/lib/applications/PersonMappers';

export const CruiseManagerInfoSection = withForm({
  defaultValues: formADefaultValues,
  props: {} as { context: FormAViewModel },
  render: function CruiseManagerInfoSection({ form, context }) {
    const { isReadonly, initValues } = context;

    return (
      <AppAccordion
        title="1. Kierownik zgłaszanego rejsu"
        expandedByDefault
        data-testid="form-a-cruise-manager-section"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <form.AppField
            name="cruiseManagerId"
            children={(field) => (
              <field.SelectField
                label="Kierownik rejsu"
                showRequiredAsterisk
                placeholder="Wybierz kierownika rejsu"
                allOptions={initValues.cruiseManagers.map(mapPersonToLabel)}
                disabled={isReadonly}
                data-testid-button="form-a-cruise-manager-button"
              />
            )}
          />

          <form.AppField
            name="deputyManagerId"
            children={(field) => (
              <field.SelectField
                label="Zastępca kierownika rejsu"
                showRequiredAsterisk
                placeholder="Wybierz zastępcę kierownika rejsu"
                allOptions={initValues.deputyManagers.map(mapPersonToLabel)}
                disabled={isReadonly}
                data-testid-button="form-a-deputy-manager-button"
                data-testid-errors="form-a-deputy-manager-errors"
              />
            )}
          />

          <form.AppField
            name="year"
            children={(field) => (
              <field.SelectField
                label="Rok"
                showRequiredAsterisk
                placeholder="Wybierz rok"
                allOptions={initValues.years.map((year) => ({
                  value: year,
                  inlineLabel: year,
                }))}
                disabled={isReadonly}
                data-testid-button="form-a-year-button"
              />
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
