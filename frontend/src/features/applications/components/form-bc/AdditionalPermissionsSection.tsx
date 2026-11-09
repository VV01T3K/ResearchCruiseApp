import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { withFieldGroup } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { PermissionValues } from '@/features/applications/schemas/types/PermissionValues';

export const AdditionalPermissionsSection = withFieldGroup({
  defaultValues: { permissions: [] as PermissionValues[] },
  props: {} as { title: string; markScanRequired?: boolean; context: Pick<FormBViewModel, 'isReadonly'> },
  render: function Render({ group, title, markScanRequired, context }) {
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
            <group.AppField name={`permissions[${row.index}].description`}>
              {(field) => (
                <field.TextField
                  aria-label={`Treść pozwolenia, wiersz ${row.index + 1}`}
                  containerClassName="mx-4"
                  disabled={isReadonly}
                />
              )}
            </group.AppField>
          ),
          size: 20,
        },
        {
          header: 'Organ wydający',
          accessorFn: (row) => row.executive,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <group.AppField name={`permissions[${row.index}].executive`}>
              {(field) => (
                <field.TextField
                  aria-label={`Organ wydający, wiersz ${row.index + 1}`}
                  className="mx-4"
                  disabled={isReadonly}
                />
              )}
            </group.AppField>
          ),
          size: 20,
        },
        {
          id: 'scan',
          header: markScanRequired
            ? ({ table }) => {
                const showRequiredAsterisk = table.getRowModel().rows.length > 0;
                return (
                  <span title={showRequiredAsterisk ? 'Pole jest obowiązkowe do wypełnienia' : undefined}>
                    Skan
                    {showRequiredAsterisk && <span className="ml-1 font-bold text-danger">*</span>}
                  </span>
                );
              }
            : 'Skan',
          accessorFn: (row) => row.scan,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <group.AppField name={`permissions[${row.index}].scan`}>
              {(field) => <field.FileField acceptedMimeTypes={['application/pdf']} disabled={isReadonly} />}
            </group.AppField>
          ),
          size: 10,
        },
        {
          id: 'actions',
          header: () => <span className="sr-only">Akcje</span>,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <TableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
            </div>
          ),
          size: 5,
        },
      ];
    }

    return (
      <Accordion title={title} expandedByDefault>
        <group.AppField name="permissions" mode="array">
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
                      field.pushValue({ description: '', executive: '' });
                      field.handleBlur();
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj pozwolenie
                  </Button>,
                ]}
                emptyTableMessage="Nie dodano żadnego pozwolenia."
                disabled={isReadonly}
                errors={getErrors(field.state.meta, group.form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, group.form.state.submissionAttempts)} />
            </>
          )}
        </group.AppField>
      </Accordion>
    );
  },
});
