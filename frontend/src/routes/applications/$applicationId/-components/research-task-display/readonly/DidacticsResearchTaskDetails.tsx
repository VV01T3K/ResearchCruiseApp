import { AppInput } from '@/components/shared/inputs/AppInput';
import type { ResearchTaskDetailsData } from './ResearchTaskDetails';

type Props = {
  data: ResearchTaskDetailsData;
};
export function DidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <AppInput
        name="researchTasks[].description"
        value={data.description ?? ''}
        label="Opis zajęcia dydaktycznego"
        placeholder="Wprowadź opis zajęcia dydaktycznego"
        disabled={true}
      />
    </div>
  );
}
