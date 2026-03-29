import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/AppAccordion';
import { AppTable } from '@/components/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useFormB } from '@/features/cruise-applications/contexts/FormBContext';
import { getTaskName, ResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';

export function FormBResearchTasksSection() {
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
      cell: ({ row }) => <ReadOnlyResearchTaskDetails data={row.original} />,
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
