import { AppInput } from '@/components/shared/inputs/AppInput';
import { OtherResearchTaskDto } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskDto';

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
