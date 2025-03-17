import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppTable } from '@/core/components/table/AppTable';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { EvaluationFormAResearchTask } from '@/cruise-applications/models/EvaluationDto';
import { getTaskName } from '@/cruise-applications/models/ResearchTaskDto';

import { ReadOnlyResearchTaskDetails } from './research-task-details/ReadOnlyResearchTaskDetails';

export function ApplicationDetailsResearchTasksSection() {
  const { evaluation } = useApplicationDetails();

  const columns: ColumnDef<EvaluationFormAResearchTask>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => getTaskName(row.researchTask.type),
      cell: ({ row }) => getTaskName(row.original.researchTask.type) ?? 'Nieznany typ',
      size: 25,
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
        />
      </div>
    </AppAccordion>
  );
}
