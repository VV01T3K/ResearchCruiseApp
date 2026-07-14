import { ThesisResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ThesisResearchTaskValues;
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
