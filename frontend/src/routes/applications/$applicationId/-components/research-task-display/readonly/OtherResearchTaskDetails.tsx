import { Input } from '@/components/shared/inputs/Input';
import type { OtherResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: OtherResearchTaskValues;
};
export function OtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <Input
        name="researchTasks[].description"
        value={data.description}
        label="Opis zadania"
        placeholder="Wprowadź opis zadania"
        disabled={true}
      />
    </div>
  );
}
