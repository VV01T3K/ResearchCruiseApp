import { AppInput } from '@/components/shared/inputs/AppInput';
import { OtherResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';

type Props = {
  data: OtherResearchTaskDto;
};
export function OtherResearchTaskDetails({ data }: Props) {
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
