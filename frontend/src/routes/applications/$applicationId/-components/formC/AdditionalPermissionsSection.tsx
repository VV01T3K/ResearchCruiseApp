import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

export function AdditionalPermissionsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
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
          <form.AppField
            name={`permissions[${row.index}].description`}
            children={(field) => <field.TextField containerClassName="mx-4" disabled={isReadonly} />}
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
          <form.AppField
            name={`permissions[${row.index}].executive`}
            children={(field) => <field.TextField className="mx-4" disabled={isReadonly} />}
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
          <form.AppField
            name={`permissions[${row.index}].scan`}
            children={(field) => <field.FileField acceptedMimeTypes={['application/pdf']} disabled={isReadonly} />}
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
      <form.AppField
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
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
            />
            <AppInputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
          </>
        )}
      />
    </AppAccordion>
  );
}
