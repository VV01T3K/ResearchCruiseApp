import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/AppAccordion';
import { AppTable } from '@/components/table/AppTable';
import { useFormB } from '@/features/cruise-applications/contexts/FormBContext';
import { ResearchAreaDescriptionDto } from '@/features/cruise-applications/models/ResearchAreaDescriptionDto';
import { getResearchAreaName } from '@/features/cruise-applications/models/ResearchAreaDto';

export function FormBResearchAreaSection() {
  const { formA, formAInitValues, isReadonly } = useFormB();

  const columns: ColumnDef<ResearchAreaDescriptionDto>[] = [
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
