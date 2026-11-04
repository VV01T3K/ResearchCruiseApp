import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { YearPickerInput } from '@/components/shared/inputs/dates/YearPickerInput';
import { Table } from '@/components/shared/table/Table';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';
import {
  type ApplicationEvaluation,
  useApplicationEvaluation,
} from '@/features/applications/hooks/useApplicationDetails';
import { getPublicationCategoryLabel } from '@/features/applications/schemas/types/PublicationValues';

export function PublicationsSection() {
  const evaluation = useApplicationEvaluation();

  const columns: ColumnDef<ApplicationEvaluation['formAPublications'][number]>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Kategoria',
      accessorFn: (row) => row.publication.category,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => <div>{getPublicationCategoryLabel(row.original.publication.category)}</div>,
      size: 10,
    },
    {
      header: 'Informacje',
      accessorFn: (row) =>
        `${row.publication.doi}, ${row.publication.authors}, ${row.publication.title}, ${row.publication.magazine}`,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            aria-label={`DOI, wiersz ${row.index + 1}`}
            name={`publications[${row.index}].publication.doi`}
            value={row.original.publication.doi}
            label="DOI"
            showRequiredAsterisk
            disabled
          />
          <Input
            aria-label={`Autorzy, wiersz ${row.index + 1}`}
            name={`publications[${row.index}].publication.authors`}
            value={row.original.publication.authors}
            label="Autorzy"
            showRequiredAsterisk
            disabled
          />
          <Input
            aria-label={`Tytuł publikacji, wiersz ${row.index + 1}`}
            name={`publications[${row.index}].publication.title`}
            value={row.original.publication.title}
            label="Tytuł"
            showRequiredAsterisk
            disabled
          />
          <Input
            aria-label={`Czasopismo publikacji, wiersz ${row.index + 1}`}
            name={`publications[${row.index}].publication.magazine`}
            value={row.original.publication.magazine}
            label="Czasopismo"
            showRequiredAsterisk
            disabled
          />
        </div>
      ),
      size: 50,
    },
    {
      header: 'Rok wydania',
      accessorFn: (row) => row.publication.year,
      enableColumnFilter: false,
      enableSorting: false,
      cell: function YearCell({ row }) {
        const name = `publications[${row.index}].publication.year`;
        const { year } = row.original.publication;
        const errors = useUnreadableErrors(name, year, true);
        return <YearPickerInput name={name} value={year ?? undefined} errors={errors} showRequiredAsterisk disabled />;
      },
      size: 10,
    },
    {
      header: 'Punkty ministerialne',
      accessorFn: (row) => row.publication.ministerialPoints,
      enableColumnFilter: false,
      enableSorting: false,
      cell: function MinisterialPointsCell({ row }) {
        const name = `publications[${row.index}].publication.ministerialPoints`;
        const { ministerialPoints } = row.original.publication;
        const errors = useUnreadableErrors(name, ministerialPoints, true);
        return (
          <NumberInput
            name={name}
            aria-label={`Punkty ministerialne, wiersz ${row.index + 1}`}
            value={ministerialPoints}
            errors={errors}
            minimum={0}
            showRequiredAsterisk
            disabled
          />
        );
      },
      size: 10,
    },
    {
      header: 'Punkty',
      accessorFn: (row) => row.points,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => <div>{row.original.points}</div>,
      size: 5,
    },
  ];

  return (
    <Accordion title="6. Publikacje" expandedByDefault>
      <div className="pb-2">
        <Table
          data={evaluation.formAPublications}
          columns={columns}
          emptyTableMessage="Nie dodano żadnej publikacji."
          disabled
        />
      </div>
    </Accordion>
  );
}
