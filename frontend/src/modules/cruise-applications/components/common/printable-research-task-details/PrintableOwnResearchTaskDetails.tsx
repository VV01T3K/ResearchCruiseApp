import dayjs from 'dayjs';

import { OwnResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  data: OwnResearchTaskDto;
};
export function PrintableOwnResearchTaskDetails({ data }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Roboczy tytuł projektu: </span>
        <span>{data.title}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Przewidywany termin składania: </span>
        <span>{dayjs(data.date).format('DD.MM.YYYY')}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Czasopismo: </span>
        <span>{data.magazine}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Przewidywane punkty ministerialne: </span>
        <span>{data.ministerialPoints}</span>
      </div>
    </div>
  );
}
