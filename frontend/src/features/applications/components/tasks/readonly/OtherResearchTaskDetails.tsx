import { Input } from '@/components/shared/inputs/Input';
import type { OtherResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: OtherResearchTaskValues;
};
export function OtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <Input
        aria-label={`Opis zadania, ${data.description}`}
        name="researchTasks[].description"
        value={data.description}
        label="Opis zadania"
        placeholder="Wprowadź opis zadania"
        disabled={true}
      />
    </div>
  );
}
