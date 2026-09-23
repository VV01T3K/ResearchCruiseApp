import { ColumnDef } from '@/integrations/tanstack/table/features';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppYearPickerInput } from '@/components/shared/inputs/dates/AppYearPickerInput';
import { AppTable } from '@/components/shared/table/AppTable';
import { useApplicationEvaluation } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';
import { ScoredSpubTask } from '@/api/generated/schemas';

export function SPUBTasksSection() {
  const evaluation = useApplicationEvaluation();

  const columns: ColumnDef<ScoredSpubTask>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Rok rozpoczęcia',
      accessorFn: (row) => row.spubTask.yearFrom,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppYearPickerInput
          name={`spubTasks[${row.index}].yearFrom`}
          value={Number(row.original.spubTask.yearFrom)}
          showRequiredAsterisk
          disabled
        />
      ),
      size: 20,
    },
    {
      header: 'Rok zakończenia',
      accessorFn: (row) => row.spubTask.yearTo,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppYearPickerInput
          name={`spubTasks[${row.index}].yearTo`}
          value={Number(row.original.spubTask.yearTo)}
          showRequiredAsterisk
          disabled
        />
      ),
      size: 20,
    },
    {
      header: 'Nazwa zadania',
      accessorFn: (row) => row.spubTask.name,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppInput
          name={`spubTasks[${row.index}].name`}
          value={row.original.spubTask.name ?? ''}
          showRequiredAsterisk
          disabled
        />
      ),
      size: 50,
    },
    {
      header: 'Punkty',
      cell: ({ row }) => row.original.points,
      size: 5,
    },
  ];

  return (
    <AppAccordion
      title="7. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
      expandedByDefault
    >
      <div>
        <AppTable
          data={evaluation.formASpubTasks}
          columns={columns}
          emptyTableMessage="Nie dodano żadnego zadania."
          disabled
        />
      </div>
    </AppAccordion>
  );
}
