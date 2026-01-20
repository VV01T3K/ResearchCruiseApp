import dayjs from 'dayjs';

import { ProjectResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: ProjectResearchTaskDto;
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
        <span>{parseFloat(data.financingAmount).toFixed(2)} zł</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Środki zabezpieczone na realizację rejsu: </span>
        <span>{parseFloat(data.securedAmount).toFixed(2)} zł</span>
      </div>
    </div>
  );
}
