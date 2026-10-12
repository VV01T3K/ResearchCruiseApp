import { formatDate } from '@/lib/dateUtils';

import type { ResearchTaskFields } from '@/api/generated/schemas';

type Props = {
  task: ResearchTaskFields;
};
export function ProjectResearchTaskThumbnail({ task }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <span>Tytuł: {task.title}</span>•
      <span>
        {formatDate(task.startDate ?? '', 'monthYear')} - {formatDate(task.endDate ?? '', 'monthYear')}
      </span>
      •<span>Kwota: {task.financingAmount} zł</span>
    </div>
  );
}
