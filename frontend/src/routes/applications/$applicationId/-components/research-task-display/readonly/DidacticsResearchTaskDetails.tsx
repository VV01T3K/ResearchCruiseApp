import { Input } from '@/components/shared/inputs/Input';
import type { DidacticsResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  data: DidacticsResearchTaskValues;
};
export function DidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <Input
        name="researchTasks[].description"
        value={data.description}
        label="Opis zajęcia dydaktycznego"
        placeholder="Wprowadź opis zajęcia dydaktycznego"
        disabled={true}
      />
    </div>
  );
}
