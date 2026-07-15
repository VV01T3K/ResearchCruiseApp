import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { ResearchAreaValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { getResearchAreaName } from '@/api/applications/types/ResearchAreaOption';

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
    <AppAccordion title="5. Rejony prowadzanego badań" expandedByDefault data-testid="form-b-research-area-section">
      <AppTable
        data={formA.researchAreaDescriptions}
        columns={columns}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego rejonu."
        showRequiredAsterisk
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
