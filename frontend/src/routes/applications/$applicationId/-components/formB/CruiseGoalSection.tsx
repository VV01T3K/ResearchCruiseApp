import { Accordion } from '@/components/shared/Accordion';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { Input } from '@/components/shared/inputs/Input';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';

export function CruiseGoalSection({ context }: { context: FormBViewModel }) {
  const { formA, formAInitValues } = context;

  return (
    <Accordion title="6. Cel rejsu" expandedByDefault>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <DropdownInput
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
          <Input name="cruiseGoalDescription" value={formA.cruiseGoalDescription} label="Opis" disabled />
        </div>
      </div>
    </Accordion>
  );
}
