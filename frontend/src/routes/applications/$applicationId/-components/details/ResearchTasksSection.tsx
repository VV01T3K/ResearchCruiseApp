import { ColumnDef } from '@/integrations/tanstack/table/features';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import {
  type ApplicationEvaluation,
  useApplicationEvaluation,
} from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';
import { getTaskName } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

export function ResearchTasksSection() {
  const evaluation = useApplicationEvaluation();

  const columns: ColumnDef<ApplicationEvaluation['formAResearchTasks'][number]>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => getTaskName(row.researchTask.type),
      cell: ({ row }) => getTaskName(row.original.researchTask.type),
      size: 20,
    },
    {
      header: 'Szczegóły',
      cell: ({ row }) => <ResearchTaskDetails data={row.original.researchTask} />,
    },
    {
      header: 'Punkty',
      cell: ({ row }) => row.original.points,
      size: 10,
    },
  ];

  return (
    <AppAccordion title="2. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <div className="pb-2">
        <AppTable
          data={evaluation.formAResearchTasks}
          columns={columns}
          buttons={(defaultButtons) => [...defaultButtons]}
          emptyTableMessage="Nie dodano żadnego zadania."
          disabled
        />
      </div>
    </AppAccordion>
  );
}
