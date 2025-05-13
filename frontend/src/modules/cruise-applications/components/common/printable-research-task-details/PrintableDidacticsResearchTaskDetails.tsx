import { DidacticsResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: DidacticsResearchTaskDto;
};
export function PrintableDidacticsResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Opis zajęcia dydaktycznego:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
