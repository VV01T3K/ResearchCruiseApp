import { getErrorMessage } from '@/api/errors';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { useRef } from 'react';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { toast } from '@/components/shared/layout/toast';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBFormApi, FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';
import { CruiseDayValues } from '@/features/applications/schemas/types/CruiseDayValues';
import { exportCruiseDayDetailsToXlsx, parseCruiseDayDetailsFromFile } from '@/lib/applications/csvParser';
import { plural } from '@/lib/plural';

const cruiseDayKey = (row: CruiseDayValues) =>
  JSON.stringify([row.number, row.hours, row.taskName, row.region, row.position, row.comment]);

const cruiseDayDetailsColumns = (form: FormBFormApi, isReadonly: boolean): ColumnDef<CruiseDayValues>[] => [
  {
    header: 'Dzień',
    enableColumnFilter: false,
    enableSorting: false,
    accessorFn: (row) => row.number,
    cell: ({ row }) => (
      <form.AppField name={`cruiseDaysDetails[${row.index}].number`}>
        {(field) => (
          <field.NumberField
            aria-label={`Dzień, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
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
        {(field) => (
          <field.NumberField
            aria-label={`Liczba godzin, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            minimum={0}
            type="integer"
          />
        )}
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
        {(field) => (
          <field.TextField
            aria-label={`Nazwa zadania, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Nazwa zadania"
          />
        )}
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
        {(field) => (
          <field.TextField
            aria-label={`Rejon zadania, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Rejon zadania"
          />
        )}
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
        {(field) => (
          <field.TextField
            aria-label={`Pozycja, wiersz ${row.index + 1}`}
            disabled={isReadonly}
            placeholder="Pozycja"
          />
        )}
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
        {(field) => (
          <field.TextField aria-label={`Uwagi, wiersz ${row.index + 1}`} disabled={isReadonly} placeholder="Uwagi" />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  ...(!isReadonly
    ? [
        {
          id: 'actions',
          header: ActionsHeader,
          cell: DeleteRowCell,
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
        `Wczytano ${rows.length} ${plural(rows.length, 'wiersz', 'wiersze', 'wierszy')} z pliku ${file.name}.` +
          (duplicates > 0
            ? ` Uwaga: ${duplicates} z nich ${plural(duplicates, 'był', 'były', 'było')} już w tabeli, sprawdź duplikaty.`
            : '')
      );
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, `Nie udało się wczytać pliku ${file.name}`));
    } finally {
      toast.dismiss(toastId);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const columns = cruiseDayDetailsColumns(form, isReadonly);

  return (
    <Accordion title="13. Szczegółowy plan zadań do realizacji podczas rejsu" expandedByDefault>
      <form.AppField name="cruiseDaysDetails" mode="array">
        {(field) => (
          <>
            <Table
              data={field.state.value}
              columns={columns}
              meta={{
                removeRow: (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
              }}
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
