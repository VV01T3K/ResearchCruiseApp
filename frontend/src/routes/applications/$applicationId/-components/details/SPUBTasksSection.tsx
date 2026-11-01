import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Input } from '@/components/shared/inputs/Input';
import { YearPickerInput } from '@/components/shared/inputs/dates/YearPickerInput';
import { Table } from '@/components/shared/table/Table';
import {
  type ApplicationEvaluation,
  useApplicationEvaluation,
} from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';

export function SPUBTasksSection() {
  const evaluation = useApplicationEvaluation();

  const columns: ColumnDef<ApplicationEvaluation['formASpubTasks'][number]>[] = [
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
        <YearPickerInput
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
        <YearPickerInput
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
        <Input name={`spubTasks[${row.index}].name`} value={row.original.spubTask.name} showRequiredAsterisk disabled />
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
    <Accordion
      title="7. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
      expandedByDefault
    >
      <div>
        <Table
          data={evaluation.formASpubTasks}
          columns={columns}
          emptyTableMessage="Nie dodano żadnego zadania."
          disabled
        />
      </div>
    </Accordion>
  );
}
