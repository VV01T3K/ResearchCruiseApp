import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { ResearchTaskDetails } from '@/routes/_authed/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { useFormB } from '@/contexts/applications/FormBContext';
import { getTaskName, ResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';

export function ResearchTasksSection() {
  const { formA, isReadonly } = useFormB();

  const columns: ColumnDef<ResearchTaskDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => getTaskName(row.type) ?? 'Nieznany typ',
      size: 20,
    },
    {
      header: 'Szczegóły',
      cell: ({ row }) => <ResearchTaskDetails data={row.original} />,
      size: 70,
    },
  ];

  return (
    <AppAccordion
      title="7. Zadania do zrealizowania w trakcie rejsu"
      expandedByDefault
      data-testid="form-b-research-tasks-section"
    >
      <AppTable
        data={formA.researchTasks}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        showRequiredAsterisk
        variant="form"
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
