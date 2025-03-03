import { AppInput } from '@/core/components/inputs/AppInput';
import { OtherResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: OtherResearchTaskDto;
};
export function ReadOnlyOtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <AppInput
        name="researchTasks[].description"
        value={data.description}
        label="Opis zadania"
        placeholder="Wprowadź opis zadania"
        required
        disabled={true}
      />
    </div>
  );
}
