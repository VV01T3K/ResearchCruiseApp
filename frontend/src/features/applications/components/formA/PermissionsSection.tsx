import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/features/applications/models/formA-view-model';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { PermissionValues } from '@/features/applications/schemas/types/PermissionValues';

export function PermissionsSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly } = context;

  function getColumns(removeRow: (index: number) => void): ColumnDef<PermissionValues>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
      },
      {
        header: 'Treść pozwolenia',
        accessorFn: (row) => row.description,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`permissions[${row.index}].description`}>
            {(field) => (
              <field.TextField
                aria-label={`Treść pozwolenia, wiersz ${row.index + 1}`}
                containerClassName="mx-4"
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 45,
      },
      {
        header: 'Organ wydający',
        accessorFn: (row) => row.executive,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`permissions[${row.index}].executive`}>
            {(field) => (
              <field.TextField
                aria-label={`Organ wydający, wiersz ${row.index + 1}`}
                className="mx-4"
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 45,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Akcje</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableDeleteRowButton
              onClick={() => {
                removeRow(row.index);
              }}
              disabled={isReadonly}
            />
          </div>
        ),
        size: 5,
      },
    ];
  }

  return (
    <Accordion title="3. Dodatkowe pozwolenia do planowanych podczas rejsu badań" expandedByDefault>
      <div>
        <form.AppField name="permissions" mode="array">
          {(field) => (
            <>
              <Table
                columns={getColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <Button
                    key="permissions.add-btn"
                    onClick={() => {
                      field.pushValue({
                        description: '',
                        executive: '',
                        scan: undefined,
                      } as PermissionValues);
                      field.handleBlur();
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj pozwolenie
                  </Button>,
                ]}
                emptyTableMessage="Nie dodano żadnego pozwolenia."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </>
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
