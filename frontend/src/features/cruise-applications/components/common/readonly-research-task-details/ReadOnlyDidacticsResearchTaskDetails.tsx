import { AppInput } from '@/components/inputs/AppInput';
import { DidacticsResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: DidacticsResearchTaskDto;
};
export function ReadOnlyDidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <AppInput
        name="researchTasks[].description"
        value={data.description}
        label="Opis zajęcia dydaktycznego"
        placeholder="Wprowadź opis zajęcia dydaktycznego"
        disabled={true}
      />
    </div>
  );
}
