import { ColumnDef } from '@tanstack/react-table';
import { useRef } from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { withForm } from '@/lib/form';
import type { FormBFormApi, FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { CruiseDayValues } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import {
  exportCruiseDayDetailsToXlsx,
  parseCruiseDayDetailsFromCsv,
  parseCruiseDayDetailsFromFile,
  readFileAsText,
} from '@/lib/applications/csvParser';

const cruiseDayDetailsColumns = (
  form: FormBFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<CruiseDayValues>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].number`}
        children={(field) => (
          <field.NumberField
            data-testid-input="cruise-day-number-input"
            data-testid-errors="cruise-day-number-errors"
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
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].hours`}
        children={(field) => (
          <field.NumberField
            data-testid-input="cruise-day-hours-input"
            data-testid-errors="cruise-day-hours-errors"
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
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].taskName`}
        children={(field) => (
          <field.TextField
            data-testid="cruise-day-task-name-input"
            data-testid-errors="cruise-day-task-name-errors"
            onChange={field.setValue}
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
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].region`}
        children={(field) => (
          <field.TextField
            data-testid="cruise-day-region-input"
            data-testid-errors="cruise-day-region-errors"
            onChange={field.setValue}
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
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].position`}
        children={(field) => (
          <field.TextField
            data-testid="cruise-day-position-input"
            data-testid-errors="cruise-day-position-errors"
            onChange={field.setValue}
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
      <form.AppField
        name={`cruiseDaysDetails[${row.index}].comment`}
        children={(field) => (
          <field.TextField
            data-testid="cruise-day-comment-input"
            data-testid-errors="cruise-day-comment-errors"
            onChange={field.setValue}
            disabled={isReadonly}
            placeholder="Uwagi"
          />
        )}
      />
    ),
    size: 20,
  },
  ...(!isReadonly
    ? [
        {
          id: 'actions',
          cell: ({ row }) => (
            <div className="flex justify-end">
              <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
            </div>
          ),
          size: 10,
        } as ColumnDef<CruiseDayValues>,
      ]
    : []),
];

export const CruiseDayDetailsSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function CruiseDayDetailsSection({ form, context }) {
    const { isReadonly } = context;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const isXlsx = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');
      const toastId = toast.loading(isXlsx ? 'Wczytywanie pliku XLSX...' : 'Wczytywanie pliku CSV...');

      try {
        let rows: CruiseDayValues[];

        if (isXlsx) {
          rows = await parseCruiseDayDetailsFromFile(file);
        } else {
          const csvContent = await readFileAsText(file);
          rows = parseCruiseDayDetailsFromCsv(csvContent);
        }

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

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <AppAccordion
        title="13. Szczegółowy plan zadań do realizacji podczas rejsu"
        expandedByDefault
        data-testid="form-b-cruise-day-details-section"
      >
        <form.AppField
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
                columns={cruiseDayDetailsColumns(
                  form,
                  (index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  },
                  isReadonly
                )}
                buttons={() => {
                  const buttons = [];
                  if (!isReadonly) {
                    buttons.push(
                      <AppButton
                        key="new"
                        data-testid="form-b-add-cruise-day-task-btn"
                        onClick={() => {
                          field.pushValue({
                            number: 0,
                            hours: 0,
                            taskName: '',
                            region: '',
                            position: '',
                            comment: '',
                          });
                          field.handleChange((prev: CruiseDayValues[]) => prev);
                          field.handleBlur();
                        }}
                        variant="primary"
                        disabled={isReadonly}
                      >
                        Dodaj
                      </AppButton>
                    );
                    buttons.push(
                      <AppButton
                        key="import"
                        onClick={() => fileInputRef.current?.click()}
                        variant="primaryOutline"
                        disabled={isReadonly}
                      >
                        Importuj z CSV/XLSX
                      </AppButton>
                    );
                  }
                  if (field.state.value && field.state.value.length > 0) {
                    buttons.push(
                      <AppButton
                        key="download"
                        onClick={() => {
                          const data = field.state.value;
                          if (data && data.length > 0) {
                            exportCruiseDayDetailsToXlsx(data, 'pozycje.xlsx');
                          } else {
                            toast.error('Brak danych do pobrania');
                          }
                        }}
                        variant="primaryOutline"
                        disabled={!field.state.value || field.state.value.length === 0}
                      >
                        Pobierz XLSX
                      </AppButton>
                    );
                  }
                  return buttons;
                }}
                variant="form"
              />
            </>
          )}
        />
      </AppAccordion>
    );
  },
});
