import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { PermissionDto } from '@/cruise-applications/models/PermissionDto';

export function FormBAdditionalPermissionsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getColumns(field: any): ColumnDef<PermissionDto>[] {
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
              {showRequiredAsterisk && <span className="ml-1 text-red-600 font-bold">*</span>}
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                field.removeValue(row.index);
                field.handleChange((prev: PermissionDto[]) => prev);
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
              columns={getColumns(field)}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="permissions.add-btn"
                  data-testid="form-b-add-permission-btn"
                  onClick={() => {
                    field.pushValue({ description: '', executive: '' });
                    field.handleChange((prev: PermissionDto[]) => prev);
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
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            />
            <AppInputErrorsList errors={getErrors(field.state.meta)} />
          </>
        )}
      />
    </AppAccordion>
  );
}
