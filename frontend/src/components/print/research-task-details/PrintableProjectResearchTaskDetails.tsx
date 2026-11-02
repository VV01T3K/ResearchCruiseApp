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
        <span>
          {typeof data.financingAmount === 'number' ? data.financingAmount.toFixed(2) : (data.financingAmount ?? '-')}{' '}
          zł
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Środki zabezpieczone na realizację rejsu: </span>
        <span>
          {typeof data.securedAmount === 'number' ? data.securedAmount.toFixed(2) : (data.securedAmount ?? '-')} zł
        </span>
      </div>
    </div>
  );
}
