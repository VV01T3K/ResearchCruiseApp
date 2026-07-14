import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { getErrors } from '@/lib/utils';
import { withForm } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { CruiseGoal } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';

export const CruiseGoalSection = withForm({
  defaultValues: formADefaultValues,
  props: {} as { context: FormAViewModel },
  render: function CruiseGoalSection({ form, context }) {
    const { isReadonly, initValues, hasFormBeenSubmitted } = context;

    return (
      <AppAccordion title="5. Cel rejsu" expandedByDefault data-testid="form-a-cruise-goal-section">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                showRequiredAsterisk
                disabled={isReadonly}
                data-testid-button="form-a-cruise-goal-button"
                data-testid-errors="form-a-cruise-goal-errors"
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
                    showRequiredAsterisk
                    data-testid="form-a-cruise-goal-description-input"
                    data-testid-errors="form-a-cruise-goal-description-errors"
                  />
                )}
              />
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
