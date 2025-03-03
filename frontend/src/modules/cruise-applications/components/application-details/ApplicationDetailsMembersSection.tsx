import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppTable } from '@/core/components/table/AppTable';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { EvaluationUGTeamDto } from '@/cruise-applications/models/EvaluationDto';
import { GuestTeamDto } from '@/cruise-applications/models/GuestTeamDto';

export function ApplicationDetailsMembersSection() {
  const { evaluation } = useApplicationDetails();

  const ugTeamsColumns: ColumnDef<EvaluationUGTeamDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Jednostka',
      accessorFn: (row) => row.ugUnitName,
      cell: ({ row }) => row.original.ugUnitName,
    },
    {
      header: 'Liczba pracowników',
      accessorFn: (row) => row.noOfEmployees,
      cell: ({ row }) => (
        <AppNumberInput
          name={`ugTeams[${row.index}].noOfEmployees`}
          value={parseInt(row.original.noOfEmployees)}
          minimum={0}
          className="mx-4"
          required
          disabled
        />
      ),
    },
    {
      header: 'Liczba studentów',
      accessorFn: (row) => row.noOfStudents,
      cell: ({ row }) => (
        <AppNumberInput
          name={`ugTeams[${row.index}].noOfStudents`}
          value={parseInt(row.original.noOfStudents)}
          minimum={0}
          className="mx-4"
          required
          disabled
        />
      ),
    },
  ];

  const guestTeamsColumns: ColumnDef<GuestTeamDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Instytucja',
      accessorFn: (row) => row.name,
      cell: ({ row }) => row.original.name,
    },
    {
      header: 'Liczba osób',
      accessorFn: (row) => row.noOfPersons,
      cell: ({ row }) => (
        <AppNumberInput
          name={`guestTeams[${row.index}].noOfPersons`}
          value={parseInt(row.original.noOfPersons)}
          minimum={0}
          className="mx-4"
          required
          disabled
        />
      ),
    },
  ];

  return (
    <AppAccordion title="5. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
        <AppTable columns={ugTeamsColumns} data={evaluation.ugTeams} emptyTableMessage="Nie dodano żadnego zespołu." />

        <AppTable
          columns={guestTeamsColumns}
          data={evaluation.guestTeams}
          emptyTableMessage="Nie dodano żadnego zespołu."
        />

        <div className="col-span-2">
          <AppInput name="Punkty" value={evaluation.ugUnitsPoints} label="Punkty" required disabled />
        </div>
      </div>
    </AppAccordion>
  );
}
