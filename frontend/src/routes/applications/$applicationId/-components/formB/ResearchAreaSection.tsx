import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { ResearchAreaValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { getResearchAreaName } from '@/lib/applications/researchArea';

export function ResearchAreaSection({ context }: { context: FormBViewModel }) {
  const { formA, formAInitValues, isReadonly } = context;

  const columns: ColumnDef<ResearchAreaValues>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Rejon prowadzenia badań',
      cell: ({ row }) =>
        `${row.original.differentName ?? getResearchAreaName(formAInitValues.researchAreas, row.original.areaId!)!}`,
      size: 30,
    },
    {
      header: 'Informacje dodatkowe',
      cell: ({ row }) => `${row.original.info}`,
    },
  ];

  return (
    <Accordion title="5. Rejony prowadzenia badań" expandedByDefault>
      <Table
        data={formA.researchAreaDescriptions}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego rejonu."
        showRequiredAsterisk
        disabled={isReadonly}
      />
    </Accordion>
  );
}
