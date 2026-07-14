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
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

export const AdditionalPermissionsSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function AdditionalPermissionsSection({ form, context }) {
    const { submissionAttempts, isReadonly } = context;

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
                  errors={getErrors(field.state.meta, submissionAttempts)}
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
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
                  className="mx-4"
                  disabled={isReadonly}
                />
              )}
            />
          ),
          size: 20,
        },
        {
          header: 'Skan',
          accessorFn: (row) => row.scan,
          enableColumnFilter: false,
          enableSorting: false,
          cell: ({ row }) => (
            <form.Field
              name={`permissions[${row.index}].scan`}
              children={(field) => (
                <AppFileInput
                  name={field.name}
                  value={field.state.value}
                  acceptedMimeTypes={['application/pdf']}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
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
        title="4. Dodatkowe pozwolenia do przeprowadzonych w trakcie rejsu badań"
        expandedByDefault
        data-testid="form-c-additional-permissions-section"
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
                    data-testid="form-c-add-permission-btn"
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
                errors={getErrors(field.state.meta, submissionAttempts)}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} />
            </>
          )}
        />
      </AppAccordion>
    );
  },
});
