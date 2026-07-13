import { OtherResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';

type Props = {
  data: OtherResearchTaskDto;
};
export function PrintableOtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Opis zadania:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
