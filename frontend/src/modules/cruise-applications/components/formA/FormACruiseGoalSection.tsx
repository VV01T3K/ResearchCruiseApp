import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { CruiseGoal } from '@/cruise-applications/models/FormADto';

export function FormACruiseGoalSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="5. Cel rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form.Field
          name="cruiseGoal"
          children={(field) => (
            <AppDropdownInput
              name="cruiseGoal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e as CruiseGoal)}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Cel rejsu"
              allOptions={initValues.cruiseGoals.map((cruiseGoal, index) => ({
                value: index.toString(),
                inlineLabel: cruiseGoal,
              }))}
              required
              disabled={isReadonly}
            />
          )}
        />

        <form.Subscribe
          selector={(state) => state.values.cruiseGoal}
          children={(cruiseGoal) => (
            <form.Field
              name="cruiseGoalDescription"
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Opis"
                  placeholder="np. szczegóły dotyczące celu rejsu"
                  disabled={!cruiseGoal || isReadonly}
                  required
                />
              )}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
