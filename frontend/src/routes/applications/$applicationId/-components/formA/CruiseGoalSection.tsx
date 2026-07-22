import { AppAccordion } from '@/components/shared/AppAccordion';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

export function CruiseGoalSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

  return (
    <AppAccordion title="5. Cel rejsu" expandedByDefault data-testid="form-a-cruise-goal-section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <form.AppField
          name="cruiseGoal"
          children={(field) => (
            <field.SelectField
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
            <form.AppField
              name="cruiseGoalDescription"
              children={(field) => (
                <field.TextField
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
}
