import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { OwnResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';
import { formatDate } from '@/lib/dateUtils';

type Props = {
  data: OwnResearchTaskValues;
};
export function OwnResearchTaskDetails({ data }: Props) {
  const pointsErrors = useUnreadableErrors('researchTasks[].ministerialPoints', data.ministerialPoints, true);
  return (
    <dl className="grid grid-cols-1 gap-4 text-left lg:grid-cols-2">
      <ReadonlyField label="Roboczy tytuł projektu">{data.title}</ReadonlyField>
      <ReadonlyField label="Przewidywany termin składania">{data.date && formatDate(data.date, 'date')}</ReadonlyField>
      <ReadonlyField label="Czasopismo">{data.magazine}</ReadonlyField>
      <ReadonlyField label="Przewidywane punkty ministerialne" errors={pointsErrors}>
        {data.ministerialPoints}
      </ReadonlyField>
    </dl>
  );
}
