import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';
import { AppTable } from '@/core/components/table/AppTable';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { EvaluationFormASpubTask } from '@/cruise-applications/models/EvaluationDto';

export function ApplicationDetailsSPUBTasksSection() {
  const { evaluation } = useApplicationDetails();

  const columns: ColumnDef<EvaluationFormASpubTask>[] = [
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
          value={parseInt(row.original.spubTask.yearFrom)}
          required
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
          value={parseInt(row.original.spubTask.yearTo)}
          required
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
        <AppInput name={`spubTasks[${row.index}].name`} value={row.original.spubTask.name} required disabled />
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
