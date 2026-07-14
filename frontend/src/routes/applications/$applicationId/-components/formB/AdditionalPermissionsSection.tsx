import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { withForm } from '@/lib/form';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

export const AdditionalPermissionsSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function AdditionalPermissionsSection({ form, context }) {
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
                  data-testid="permission-description-input"
                  data-testid-errors="permission-description-errors"
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
          size: 20,
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
                  data-testid="permission-executive-input"
                  data-testid-errors="permission-executive-errors"
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
          size: 20,
        },
        {
          id: 'scan',
          header: ({ table }) => {
            const showRequiredAsterisk = table.getRowModel().rows.length > 0;
            return (
              <span title={showRequiredAsterisk ? 'Pole jest obowiązkowe do wypełnienia' : undefined}>
                Skan
                {showRequiredAsterisk && <span className="ml-1 font-bold text-red-600">*</span>}
              </span>
            );
          },
          accessorFn: (row) => row.scan,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.Field
              name={`permissions[${row.index}].scan`}
              children={(field) => (
                <AppFileInput
                  data-testid-button="permission-scan-button"
                  data-testid-errors="permission-scan-errors"
                  name={field.name}
                  value={field.state.value}
                  acceptedMimeTypes={['application/pdf']}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 10,
        },
        {
          id: 'actions',
          cell: ({ row }) => (
            <div className="flex justify-end">
              <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
            </div>
          ),
          size: 5,
        },
      ];
    }

    return (
      <AppAccordion
        title="4. Dodatkowe pozwolenia do planowanych podczas rejsu badań"
        expandedByDefault
        data-testid="form-b-additional-permissions-section"
      >
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
                    data-testid="form-b-add-permission-btn"
                    onClick={() => {
                      field.pushValue({ description: '', executive: '' });
                      field.handleChange((prev: PermissionValues[]) => prev);
                      field.handleBlur();
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj pozwolenie
                  </AppButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego pozwolenia."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta)}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} />
            </>
          )}
        />
      </AppAccordion>
    );
  },
});
