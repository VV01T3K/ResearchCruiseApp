import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { withForm } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

export const PermissionsSection = withForm({
  defaultValues: formADefaultValues,
  props: {} as { context: FormAViewModel },
  render: function PermissionsSection({ form, context }) {
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
            <form.Field
              name={`permissions[${row.index}].description`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  containerClassName="mx-4"
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 45,
        },
        {
          header: 'Organ wydający',
          accessorFn: (row) => row.executive,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.Field
              name={`permissions[${row.index}].executive`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  className="mx-4"
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 45,
        },
        {
          id: 'actions',
          cell: ({ row }) => (
            <div className="flex justify-end">
              <AppTableDeleteRowButton
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
      <AppAccordion
        title="3. Dodatkowe pozwolenia do planowanych podczas rejsu badań"
        expandedByDefault
        data-testid="form-a-permissions-section"
      >
        <div>
          <form.Field
            name="permissions"
            mode="array"
            children={(field) => (
              <>
                <AppTable
                  columns={getColumns((index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  })}
                  data={field.state.value}
                  buttons={() => [
                    <AppButton
                      key="permissions.add-btn"
                      onClick={() => {
                        field.pushValue({
                          description: '',
                          executive: '',
                          scan: undefined,
                        } as PermissionValues);
                        field.handleChange((prev: PermissionValues[]) => prev);
                        field.handleBlur();
                      }}
                      disabled={isReadonly}
                      data-testid="form-a-add-permission-btn"
                    >
                      Dodaj pozwolenie
                    </AppButton>,
                  ]}
                  emptyTableMessage="Nie dodano żadnego pozwolenia."
                  variant="form"
                  disabled={isReadonly}
                  errors={getErrors(field.state.meta)}
                  data-testid="form-a-permissions-table"
                />
                <AppInputErrorsList errors={getErrors(field.state.meta)} data-testid="form-a-permissions-errors" />
              </>
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
