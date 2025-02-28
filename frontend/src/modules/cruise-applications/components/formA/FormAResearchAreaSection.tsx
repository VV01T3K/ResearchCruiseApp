import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';

export function FormAResearchAreaSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="4. Rejon prowadzenia badań" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form.Field
          name="researchAreaId"
          children={(field) => (
            <AppDropdownInput
              name="researchAreaId"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e as string);
                if (!e) {
                  form.setFieldValue('researchAreaInfo', '');
                }
              }}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Rejon prowadzenia badań"
              allOptions={initValues.researchAreas.map((researchArea) => ({
                value: researchArea.id,
                inlineLabel: researchArea.name,
              }))}
              required
              disabled={isReadonly}
            />
          )}
        />

        <form.Subscribe
          selector={(state) => state.values.researchAreaId}
          children={(researchAreaId) => (
            <form.Field
              name="researchAreaInfo"
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Informacje dodatkowe"
                  placeholder="np. szczegóły dotyczące regionu"
                  disabled={!researchAreaId || isReadonly}
                />
              )}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
