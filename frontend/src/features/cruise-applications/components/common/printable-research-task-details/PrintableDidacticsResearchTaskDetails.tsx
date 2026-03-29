import { DidacticsResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: DidacticsResearchTaskDto;
};
export function PrintableDidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Opis zajęcia dydaktycznego:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
