import { formatDate } from '@/lib/dateUtils';

import type { ResearchTaskFields } from '@/api/generated/schemas';

type Props = {
  task: ResearchTaskFields;
};
export function ProjectPreparationResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•<span>Data: {formatDate(task.date ?? '', 'date')}</span>
    </div>
  );
}
