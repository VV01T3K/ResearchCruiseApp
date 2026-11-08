import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { SpubTaskValues } from '@/features/applications/schemas/types/SpubTaskValues';

export function SPUBTasksSection({ context }: { context: FormBViewModel }) {
  const { formA, isReadonly } = context;

  const columns: ColumnDef<SpubTaskValues>[] = [
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
    <Accordion
      title="11. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
      expandedByDefault
    >
      <Table
        data={formA.spubTasks}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        disabled={isReadonly}
      />
    </Accordion>
  );
}
