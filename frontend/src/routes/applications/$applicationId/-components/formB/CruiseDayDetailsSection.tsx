import { getErrorMessage } from '@/api/errors';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { useRef } from 'react';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { toast } from '@/components/shared/layout/toast';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBFormApi, FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { CruiseDayValues } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import { exportCruiseDayDetailsToXlsx, parseCruiseDayDetailsFromFile } from '@/lib/applications/csvParser';

const cruiseDayKey = (row: CruiseDayValues) =>
  JSON.stringify([row.number, row.hours, row.taskName, row.region, row.position, row.comment]);

function rowsWord(count: number) {
  const form = new Intl.PluralRules('pl').select(count);
  if (form === 'one') return 'wiersz';
  return form === 'few' ? 'wiersze' : 'wierszy';
}

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
      <form.AppField name={`cruiseDaysDetails[${row.index}].number`}>
        {(field) => <field.NumberField disabled={isReadonly} minimum={0} type="integer" />}
      </form.AppField>
    ),
    size: 10,
  },
  {
    header: 'Liczba godzin',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.hours,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].hours`}>
        {(field) => <field.NumberField disabled={isReadonly} minimum={0} type="integer" />}
      </form.AppField>
    ),
    size: 10,
  },
  {
    header: 'Nazwa zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.taskName,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].taskName`}>
        {(field) => <field.TextField disabled={isReadonly} placeholder="Nazwa zadania" />}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Rejon zadania',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.region,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].region`}>
        {(field) => <field.TextField disabled={isReadonly} placeholder="Rejon zadania" />}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Pozycja',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.position,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].position`}>
        {(field) => <field.TextField disabled={isReadonly} placeholder="Pozycja" />}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Uwagi',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.comment,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].comment`}>
        {(field) => <field.TextField disabled={isReadonly} placeholder="Uwagi" />}
      </form.AppField>
    ),
    size: 20,
  },
  ...(!isReadonly
    ? [
        {
          id: 'actions',
          cell: ({ row }) => (
            <div className="flex justify-end">
              <TableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
            </div>
          ),
          size: 10,
        } as ColumnDef<CruiseDayValues>,
      ]
    : []),
];

export function CruiseDayDetailsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { isReadonly } = context;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Wczytywanie pliku ${file.name}...`);
    try {
      const rows = await parseCruiseDayDetailsFromFile(file);
      const currentRows = form.getFieldValue('cruiseDaysDetails') || [];
      form.setFieldValue('cruiseDaysDetails', [...currentRows, ...rows]);
      const currentKeys = new Set(currentRows.map(cruiseDayKey));
      const duplicates = rows.filter((row) => currentKeys.has(cruiseDayKey(row))).length;
      toast.success(
        `Wczytano ${rows.length} ${rowsWord(rows.length)} z pliku ${file.name}.` +
          (duplicates > 0 ? ` Uwaga: ${duplicates} z nich było już w tabeli, sprawdź duplikaty.` : '')
      );
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, `Nie udało się wczytać pliku ${file.name}`));
    } finally {
      toast.dismiss(toastId);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Accordion title="13. Szczegółowy plan zadań do realizacji podczas rejsu" expandedByDefault>
      <form.AppField name="cruiseDaysDetails" mode="array">
        {(field) => (
          <>
            <Table
              data={field.state.value}
              columns={cruiseDayDetailsColumns(
                form,
                (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
                isReadonly
              )}
              buttons={() => {
                const buttons = [];
                if (!isReadonly) {
                  buttons.push(
                    <Button
                      key="new"
                      onClick={() => {
                        field.pushValue({
                          number: 0,
                          hours: 0,
                          taskName: '',
                          region: '',
                          position: '',
                          comment: '',
                        });
                        field.handleBlur();
                      }}
                      variant="primary"
                      disabled={isReadonly}
                    >
                      Dodaj
                    </Button>
                  );
                  buttons.push(
                    <Button
                      key="import"
                      onClick={() => fileInputRef.current?.click()}
                      variant="primaryOutline"
                      disabled={isReadonly}
                    >
                      Importuj z CSV/XLSX
                    </Button>
                  );
                }
                if (field.state.value && field.state.value.length > 0) {
                  buttons.push(
                    <Button
                      key="download"
                      onClick={() => {
                        const data = field.state.value;
                        if (data && data.length > 0) {
                          void exportCruiseDayDetailsToXlsx(data, 'pozycje.xlsx');
                        } else {
                          toast.error('Brak danych do pobrania');
                        }
                      }}
                      variant="primaryOutline"
                      disabled={!field.state.value || field.state.value.length === 0}
                    >
                      Pobierz XLSX
                    </Button>
                  );
                }
                return buttons;
              }}
              variant="form"
            />
            <input
              type="file"
              accept=".csv,.txt,.xlsx"
              onChange={(event) => void handleFileImport(event)}
              ref={fileInputRef}
              disabled={isReadonly}
              className="hidden"
            />
          </>
        )}
      </form.AppField>
    </Accordion>
  );
}
