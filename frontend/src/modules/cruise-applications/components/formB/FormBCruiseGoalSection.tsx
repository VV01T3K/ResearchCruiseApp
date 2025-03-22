import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

export function FormBCruiseGoalSection() {
  const { formA, formAInitValues } = useFormB();

  return (
    <AppAccordion title="6. Cel rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
