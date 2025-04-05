import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';

export function FormCResearchAreaSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  return (
    <AppAccordion title="5. Rejon prowadzenia badań" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <form.Field
          name="researchAreaId"
          children={(field) => (
            <AppDropdownInput
              name="researchAreaId"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e as string);
              }}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Rejon prowadzenia badań"
              allOptions={formAInitValues.researchAreas.map((researchArea) => ({
                value: researchArea.id,
                inlineLabel: researchArea.name,
              }))}
              required
              disabled={isReadonly}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
