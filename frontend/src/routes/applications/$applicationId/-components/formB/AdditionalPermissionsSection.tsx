import { ColumnDef } from '@/integrations/tanstack/table/features';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

export function AdditionalPermissionsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
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
              <field.TextField aria-label="Treść pozwolenia" containerClassName="mx-4" disabled={isReadonly} />
            )}
          </form.AppField>
        ),
        size: 20,
      },
      {
        header: 'Organ wydający',
        accessorFn: (row) => row.executive,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`permissions[${row.index}].executive`}>
            {(field) => <field.TextField aria-label="Organ wydający" className="mx-4" disabled={isReadonly} />}
          </form.AppField>
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
          <form.AppField name={`permissions[${row.index}].scan`}>
            {(field) => <field.FileField acceptedMimeTypes={['application/pdf']} disabled={isReadonly} />}
          </form.AppField>
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
    <AppAccordion title="4. Dodatkowe pozwolenia do planowanych podczas rejsu badań" expandedByDefault>
      <form.AppField name="permissions" mode="array">
        {(field) => (
          <>
            <AppTable
              columns={getColumns((index) => {
                field.removeValue(index);
                field.handleBlur();
              })}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="permissions.add-btn"
                  onClick={() => {
                    field.pushValue({ description: '', executive: '' });
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
      </form.AppField>
    </AppAccordion>
  );
}
