import { ThesisResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ThesisResearchTaskDto;
};
export function PrintableThesisResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Autor: </span>
        <span>{data.author}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Tytuł:</span>
        <span>{data.title}</span>
      </div>
    </div>
  );
}
