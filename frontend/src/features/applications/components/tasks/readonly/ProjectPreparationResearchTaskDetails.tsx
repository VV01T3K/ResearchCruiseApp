import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import type { ProjectPreparationResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';
import { formatDate } from '@/lib/dateUtils';

type Props = {
  data: ProjectPreparationResearchTaskValues;
};
export function ProjectPreparationResearchTaskDetails({ data }: Props) {
  const approvedErrors = useUnreadableErrors('researchTasks[].financingApproved', data.financingApproved, true);
  return (
    <dl className="grid grid-cols-1 gap-4 text-left lg:grid-cols-2">
      <ReadonlyField label="Roboczy tytuł projektu" className="lg:col-span-2">
        {data.title}
      </ReadonlyField>
      <ReadonlyField label="Przewidywany termin składania">{data.date && formatDate(data.date, 'date')}</ReadonlyField>
      <ReadonlyField label="Otrzymano decyzję o finansowaniu?" errors={approvedErrors}>
        {data.financingApproved === true ? 'Tak' : data.financingApproved === false ? 'Nie' : null}
      </ReadonlyField>
    </dl>
  );
}
