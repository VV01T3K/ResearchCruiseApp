import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { getErrors } from '@/lib/form-errors';
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
          <form.Field
            name="cruiseManagerId"
            children={(field) => (
              <AppDropdownInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta)}
                label="Kierownik rejsu"
                showRequiredAsterisk
                placeholder="Wybierz kierownika rejsu"
                allOptions={initValues.cruiseManagers.map(mapPersonToLabel)}
                disabled={isReadonly}
                data-testid-button="form-a-cruise-manager-button"
              />
            )}
          />

          <form.Field
            name="deputyManagerId"
            children={(field) => (
              <AppDropdownInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta)}
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

          <form.Field
            name="year"
            children={(field) => (
              <AppDropdownInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta)}
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
