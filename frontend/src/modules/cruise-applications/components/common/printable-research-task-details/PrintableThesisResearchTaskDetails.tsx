import { ThesisResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ThesisResearchTaskDto;
};
export function PrintableThesisResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Autor: </span>
        <span>{data.author}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Tytuł:</span>
        <span>{data.title}</span>
      </div>
    </div>
  );
}
