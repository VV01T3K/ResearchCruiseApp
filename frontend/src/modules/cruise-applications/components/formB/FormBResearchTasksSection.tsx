import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppTable } from '@/core/components/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/cruise-applications/components/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { getTaskName, ResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';

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
    <AppAccordion title="7. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <AppTable
        data={formA.researchTasks}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
