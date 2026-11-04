import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { Table } from '@/components/shared/table/Table';
import { useApplicationEvaluation } from '@/features/applications/hooks/useApplicationDetails';
import { NamedUgTeam } from '@/api/generated/schemas';
import type { GuestTeamFields } from '@/api/generated/schemas';

export function MembersSection() {
  const evaluation = useApplicationEvaluation();

  const ugTeamsColumns: ColumnDef<NamedUgTeam>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Jednostka',
      accessorFn: (row) => row.ugUnitName,
      cell: ({ row }) => row.original.ugUnitName,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: 'Liczba pracowników',
      accessorFn: (row) => row.noOfEmployees,
      cell: ({ row }) => (
        <NumberInput
          name={`ugTeams[${row.index}].noOfEmployees`}
          aria-label={`Liczba pracowników, wiersz ${row.index + 1}`}
          value={parseInt(row.original.noOfEmployees)}
          minimum={0}
          className="mx-4"
          showRequiredAsterisk
          disabled
        />
      ),
      size: 10,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: 'padding',
      header: () => <span className="sr-only">Odstęp</span>,
      cell: () => null,
      size: 10,
    },
    {
      header: 'Liczba studentów',
      accessorFn: (row) => row.noOfStudents,
      cell: ({ row }) => (
        <NumberInput
          name={`ugTeams[${row.index}].noOfStudents`}
          aria-label={`Liczba studentów, wiersz ${row.index + 1}`}
          value={parseInt(row.original.noOfStudents)}
          minimum={0}
          className="mx-4"
          showRequiredAsterisk
          disabled
        />
      ),
      size: 10,
      enableColumnFilter: false,
      enableSorting: false,
    },
  ];

  const guestTeamsColumns: ColumnDef<GuestTeamFields>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Instytucja',
      accessorFn: (row) => row.name,
      cell: ({ row }) => row.original.name,
      size: 70,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: 'Liczba osób',
      accessorFn: (row) => row.noOfPersons,
      cell: ({ row }) => (
        <NumberInput
          name={`guestTeams[${row.index}].noOfPersons`}
          aria-label={`Liczba osób, wiersz ${row.index + 1}`}
          value={Number(row.original.noOfPersons)}
          minimum={0}
          className="mx-4"
          showRequiredAsterisk
          disabled
        />
      ),
      size: 10,
      enableColumnFilter: false,
      enableSorting: false,
    },
  ];

  return (
    <Accordion title="5. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
        <Table
          columns={ugTeamsColumns}
          data={evaluation.ugTeams}
          emptyTableMessage="Nie dodano żadnego zespołu."
          disabled
          className="mt-0 pt-0"
        />

        <Table
          columns={guestTeamsColumns}
          data={evaluation.guestTeams}
          emptyTableMessage="Nie dodano żadnego zespołu."
          disabled
          className="mt-0 pt-0"
        />

        <div className="col-span-2">
          <NumberInput name="Punkty" value={parseInt(evaluation.ugUnitsPoints)} label="Punkty" disabled />
        </div>
      </div>
    </Accordion>
  );
}
