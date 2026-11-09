import { Fragment } from 'react';

import type { ResearchTaskFields } from '@/api/generated/schemas';
import { getTaskTypeFields } from '@/features/applications/components/research-tasks/taskTypeFields';

export function ResearchTaskThumbnail({ task }: { task: ResearchTaskFields }) {
  return (
    <div className="flex justify-center gap-2">
      {getTaskTypeFields(task.type)
        .summary(task)
        .map((part, i) => (
          <Fragment key={i}>
            {i > 0 && '•'}
            <span>{part}</span>
          </Fragment>
        ))}
    </div>
  );
}
