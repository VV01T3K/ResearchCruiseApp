import dayjs from 'dayjs';

import { OwnResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

type Props = {
  task: OwnResearchTaskValues;
};
export function OwnResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Tytuł: {task.title}</div>•<div>Data: {dayjs(task.date).format('DD.MM.YYYY')}</div>
    </div>
  );
}
