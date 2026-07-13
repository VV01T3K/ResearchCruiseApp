import { AppInput } from '@/components/shared/inputs/AppInput';
import { DidacticsResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';

type Props = {
  data: DidacticsResearchTaskDto;
};
export function DidacticsResearchTaskDetails({ data }: Props) {
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
