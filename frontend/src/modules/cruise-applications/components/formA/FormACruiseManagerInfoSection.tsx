import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { mapPersonToLabel } from '@/cruise-applications/helpers/PersonMappers';

export function FormACruiseManagerInfoSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="1. Kierownik zgłaszanego rejsu" expandedByDefault data-testid="form-a-cruise-manager-section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <form.Field
          name="cruiseManagerId"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
              onChange={(newValue) => {
                field.handleChange(newValue);
                form.validateAllFields('change');
              }}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
}
