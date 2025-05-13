import { OtherResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: OtherResearchTaskDto;
};
export function PrintableOtherResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Opis zadania:</span>
        <span>{data.description}</span>
      </div>
    </div>
  );
}
