import { AppAccordion } from '@/components/AppAccordion';
import { AppDropdownInput } from '@/components/inputs/AppDropdownInput';
import { AppInput } from '@/components/inputs/AppInput';
import { useFormC } from '@/features/cruise-applications/contexts/FormCContext';

export function FormCCruiseGoalSection() {
  const { formA, formAInitValues } = useFormC();

  return (
    <AppAccordion title="6. Cel rejsu" expandedByDefault data-testid="form-c-cruise-goal-section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <AppDropdownInput
            name="cruiseGoal"
            value={formA.cruiseGoal}
            label="Cel rejsu"
            allOptions={formAInitValues.cruiseGoals.map((cruiseGoal, index) => ({
              value: index.toString(),
              inlineLabel: cruiseGoal,
            }))}
            disabled
          />
        </div>
        <div>
          <AppInput name="cruiseGoalDescription" value={formA.cruiseGoalDescription} label="Opis" disabled />
        </div>
      </div>
    </AppAccordion>
  );
}
