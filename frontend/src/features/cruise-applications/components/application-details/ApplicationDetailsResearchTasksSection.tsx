import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/AppAccordion';
import { AppTable } from '@/components/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useApplicationDetails } from '@/features/cruise-applications/contexts/ApplicationDetailsContext';
import { EvaluationFormAResearchTask } from '@/features/cruise-applications/models/EvaluationDto';
import { getTaskName } from '@/features/cruise-applications/models/ResearchTaskDto';

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
