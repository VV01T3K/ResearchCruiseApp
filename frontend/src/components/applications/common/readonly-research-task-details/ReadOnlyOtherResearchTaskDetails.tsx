import { AppInput } from '@/components/shared/inputs/AppInput';
import { OtherResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

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
        disabled={true}
      />
    </div>
  );
}
