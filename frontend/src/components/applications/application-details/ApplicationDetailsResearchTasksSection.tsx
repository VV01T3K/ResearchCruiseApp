import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/components/applications/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';
import { EvaluationFormAResearchTask } from '@/api/dto/applications/EvaluationDto';
import { getTaskName } from '@/api/dto/applications/ResearchTaskDto';

export function ApplicationDetailsResearchTasksSection() {
  const { evaluation } = useApplicationDetails();

  const columns: ColumnDef<EvaluationFormAResearchTask>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => getTaskName(row.researchTask.type),
      cell: ({ row }) => getTaskName(row.original.researchTask.type) ?? 'Nieznany typ',
      size: 20,
    },
    {
      header: 'Szczegóły',
      cell: ({ row }) => <ReadOnlyResearchTaskDetails data={row.original.researchTask} />,
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
