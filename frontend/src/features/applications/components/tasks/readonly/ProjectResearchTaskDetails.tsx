import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { ProjectResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';
import { formatDate } from '@/lib/dateUtils';

type Props = {
  data: ProjectResearchTaskValues;
};
export function ProjectResearchTaskDetails({ data }: Props) {
  const financingErrors = useUnreadableErrors('researchTasks[].financingAmount', data.financingAmount, true);
  const securedErrors = useUnreadableErrors('researchTasks[].securedAmount', data.securedAmount, true);
  return (
    <dl className="grid grid-cols-1 gap-4 text-left lg:grid-cols-2">
      <ReadonlyField label="Tytuł" className="lg:col-span-2">
        {data.title}
      </ReadonlyField>
      <ReadonlyField label="Data rozpoczęcia">
        {data.startDate && formatDate(data.startDate, 'monthYear')}
      </ReadonlyField>
      <ReadonlyField label="Data zakończenia">{data.endDate && formatDate(data.endDate, 'monthYear')}</ReadonlyField>
      <ReadonlyField label="Kwota finansowania [zł]" errors={financingErrors}>
        {data.financingAmount}
      </ReadonlyField>
      <ReadonlyField label="Środki zabezpieczone na realizację rejsu [zł]" errors={securedErrors}>
        {data.securedAmount}
      </ReadonlyField>
    </dl>
  );
}
