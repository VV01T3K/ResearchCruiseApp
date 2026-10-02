import { formatDate } from '@/lib/dateUtils';

import type { ResearchTaskFields } from '@/api/generated/schemas';

type Props = {
  task: ResearchTaskFields;
};
export function OwnResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <div>Tytuł: {task.title}</div>•<div>Data: {formatDate(task.date ?? '', 'date')}</div>
    </div>
  );
}
