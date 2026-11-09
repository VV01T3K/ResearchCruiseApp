import { formatDate } from '@/lib/dateUtils';

import { getTaskTypeFields, type TaskField } from '@/features/applications/components/research-tasks/taskTypeFields';
import type { ResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

function printValue(kind: TaskField['kind'], value: string | number | boolean | null | undefined) {
  switch (kind) {
    case 'date':
    case 'month':
      return formatDate(value as string, 'date');
    case 'amount':
      return `${typeof value === 'number' ? value.toFixed(2) : (value ?? '-')} zł`;
    case 'yesNo':
      return value === true ? 'Tak' : 'Nie';
    default:
      return value;
  }
}

export function PrintableResearchTaskDetails({ data }: { data: ResearchTaskValues }) {
  const values: Partial<Record<TaskField['name'], string | number | boolean | null>> = data;
  return (
    <div>
      {getTaskTypeFields(data.type).fields.map(({ name, label, kind }) => (
        <div key={name} className="flex items-center justify-between">
          <span>{label}:</span>
          <span>{printValue(kind, values[name])}</span>
        </div>
      ))}
    </div>
  );
}
