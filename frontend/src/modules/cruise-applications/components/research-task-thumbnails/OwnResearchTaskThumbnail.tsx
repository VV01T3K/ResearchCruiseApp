import dayjs from 'dayjs';

import { OwnResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  task: OwnResearchTaskDto;
};
export function OwnResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Tytuł: {task.title}</div>•<div>Data: {dayjs(task.date).format('DD.MM.YYYY')}</div>
    </div>
  );
}
