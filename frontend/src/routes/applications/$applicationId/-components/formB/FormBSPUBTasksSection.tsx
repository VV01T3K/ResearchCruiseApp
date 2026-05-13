import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { useFormB } from '@/contexts/applications/FormBContext';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';

export function FormBSPUBTasksSection() {
  const { formA, isReadonly } = useFormB();

  const columns: ColumnDef<SpubTaskDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Rok rozpoczęcia',
      accessorFn: (row) => row.yearFrom,
      enableColumnFilter: false,
      enableSorting: false,
      size: 15,
    },
    {
      header: 'Rok zakończenia',
      accessorFn: (row) => row.yearTo,
      enableColumnFilter: false,
      enableSorting: false,
      size: 15,
    },
    {
      header: 'Nazwa zadania',
      accessorFn: (row) => row.name,
      enableColumnFilter: false,
      enableSorting: false,
    },
  ];

  return (
    <AppAccordion
      title="11. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
      expandedByDefault
      data-testid="form-b-spub-tasks-section"
    >
      <AppTable
        data={formA.spubTasks}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        variant="table"
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
