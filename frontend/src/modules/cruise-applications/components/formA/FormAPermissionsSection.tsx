import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { PermissionDto } from '@/cruise-applications/models/PermissionDto';

export function FormAPermissionsSection() {
  const { form, isReadonly, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'permissions', undefined, undefined, PermissionDto[]>
  ): ColumnDef<PermissionDto>[] {
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
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
        <form.Field
          name="permissions"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AppButton
                    key="permissions.add-btn"
                    onClick={() => {
                      field.pushValue({ description: '', executive: '' });
                      field.handleChange((prev) => prev);
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
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
