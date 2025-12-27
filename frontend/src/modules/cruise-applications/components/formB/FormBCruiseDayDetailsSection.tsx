import { FieldApi, ReactFormExtendedApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';
import { useRef } from 'react';
import toast from 'react-hot-toast';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { CruiseDayDetailsDto } from '@/cruise-applications/models/CruiseDayDetailsDto';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import {
  parseCruiseDayDetailsFromCsv,
  parseCruiseDayDetailsFromFile,
  readFileAsText,
} from '@/cruise-applications/utils/csvParser';

const cruiseDayDetailsColumns = (
  form: ReactFormExtendedApi<FormBDto, undefined>,
  field: FieldApi<FormBDto, 'cruiseDaysDetails', undefined, undefined, CruiseDayDetailsDto[]>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<CruiseDayDetailsDto>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].number`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={parseInt(field.state.value, 10)}
            onChange={(e) => field.setValue(e.toString())}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
      />
    ),
    size: 10,
  },
  {
    header: 'Liczba godzin',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.hours,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].hours`}
        children={(field) => (
          <AppNumberInput
            name={field.name}
            value={parseInt(field.state.value, 10)}
            onChange={(e) => field.setValue(e.toString())}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
      />
    ),
    size: 10,
  },
  {
    header: 'Nazwa zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.taskName,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].taskName`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Nazwa zadania"
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Rejon zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.region,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].region`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Rejon zadania"
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Pozycja',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.position,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].position`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Pozycja"
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Uwagi',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.comment,
    cell: ({ row }) => (
      <form.Field
        name={`cruiseDaysDetails[${row.index}].comment`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            placeholder="Uwagi"
          />
        )}
      />
    ),
    size: 20,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton
          onClick={() => {
            field.removeValue(row.index);
            field.handleChange((prev) => prev);
            field.handleBlur();
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

export function FormBCruiseDayDetailsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormB();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isXlsx = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');
    const toastId = toast.loading(isXlsx ? 'Wczytywanie pliku XLSX...' : 'Wczytywanie pliku CSV...');

    try {
      let rows: CruiseDayDetailsDto[];

      if (isXlsx) {
        rows = await parseCruiseDayDetailsFromFile(file);
      } else {
        const csvContent = await readFileAsText(file);
        rows = parseCruiseDayDetailsFromCsv(csvContent);
      }

      // Get current rows and add new rows from file
      const currentRows = form.getFieldValue('cruiseDaysDetails') || [];
      form.setFieldValue('cruiseDaysDetails', [...currentRows, ...rows]);

      toast.dismiss(toastId);
      const fileType = isXlsx ? 'XLSX' : 'CSV';
      toast.success(`Wczytano ${rows.length} wierszy z pliku ${fileType}.`);
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      const fileType = isXlsx ? 'XLSX' : 'CSV';
      toast.error(`Błąd przy wczytywaniu pliku ${fileType}: ${errorMessage}`);
      console.error('File Import Error:', error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppAccordion title="13. Szczegółowy plan zadań do realizacji podczas rejsu" expandedByDefault>
      <form.Field
        name="cruiseDaysDetails"
        mode="array"
        children={(field) => (
          <>
            <input
              type="file"
              accept=".csv,.txt,.xlsx,.xls"
              onChange={handleFileImport}
              ref={fileInputRef}
              disabled={isReadonly}
              className="hidden"
            />
            <AppTable
              data={field.state.value}
              columns={cruiseDayDetailsColumns(form, field, hasFormBeenSubmitted, isReadonly)}
              buttons={() => [
                <AppButton
                  key="new"
                  onClick={() => {
                    field.pushValue({
                      number: '0',
                      hours: '0',
                      taskName: '',
                      region: '',
                      position: '',
                      comment: '',
                    });
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  }}
                  variant="primary"
                  disabled={isReadonly}
                >
                  Dodaj
                </AppButton>,
                <AppButton
                  key="import"
                  onClick={() => fileInputRef.current?.click()}
                  variant="primaryOutline"
                  disabled={isReadonly}
                >
                  Importuj z CSV/XLSX
                </AppButton>,
              ]}
              variant="form"
              disabled={isReadonly}
            />
          </>
        )}
      />
    </AppAccordion>
  );
}
