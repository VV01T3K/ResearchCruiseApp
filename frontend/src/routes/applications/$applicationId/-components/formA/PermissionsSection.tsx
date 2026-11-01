import { ColumnDef } from '@/integrations/tanstack/table/features';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';

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
            {(field) => <field.TextField containerClassName="mx-4" disabled={isReadonly} />}
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
            {(field) => <field.TextField className="mx-4" disabled={isReadonly} />}
          </form.AppField>
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
    <AppAccordion title="3. Dodatkowe pozwolenia do planowanych podczas rejsu badań" expandedByDefault>
      <div>
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
      </div>
    </AppAccordion>
  );
}
