import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import { ResearchTaskDetails } from '@/features/applications/components/tasks/readonly/ResearchTaskDetails';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { getTaskName, ResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

export function ResearchTasksSection({ context }: { context: FormBViewModel }) {
  const { formA, isReadonly } = context;

  const columns: ColumnDef<ResearchTaskValues>[] = [
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
    <Accordion title="7. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <Table
        data={formA.researchTasks}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego zadania."
        showRequiredAsterisk
        variant="form"
        disabled={isReadonly}
      />
    </Accordion>
  );
}
