import { formatDate } from '@/lib/dateUtils';

import { ProjectResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  data: ProjectResearchTaskValues;
};
export function PrintableProjectResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Tytuł: </span>
        <span>{data.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Data rozpoczęcia: </span>
        <span>{formatDate(data.startDate, 'date')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Data zakończenia: </span>
        <span>{formatDate(data.endDate, 'date')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Kwota finansowania: </span>
        <span>{parseFloat(data.financingAmount).toFixed(2)} zł</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Środki zabezpieczone na realizację rejsu: </span>
        <span>{parseFloat(data.securedAmount).toFixed(2)} zł</span>
      </div>
    </div>
  );
}
