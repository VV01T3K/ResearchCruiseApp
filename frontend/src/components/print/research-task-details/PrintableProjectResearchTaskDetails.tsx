import dayjs from 'dayjs';

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
        <span>{dayjs(data.startDate).format('DD.MM.YYYY')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Data zakończenia: </span>
        <span>{dayjs(data.endDate).format('DD.MM.YYYY')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Kwota finansowania: </span>
        <span>{data.financingAmount?.toFixed(2) ?? '-'} zł</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Środki zabezpieczone na realizację rejsu: </span>
        <span>{data.securedAmount?.toFixed(2) ?? '-'} zł</span>
      </div>
    </div>
  );
}
