import { AnyFieldApi } from '@tanstack/form-core';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppTable } from '@/core/components/table/AppTable';
import { AnyReactFormApi } from '@/core/lib/form';
import { getErrors } from '@/core/lib/utils';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { FormCDto } from '@/cruise-applications/models/FormCDto';
import { ShipEquipmentDto } from '@/cruise-applications/models/ShipEquipmentDto';

const shipEquipmentColumns = (
  form: AnyReactFormApi<FormCDto>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<ShipEquipmentDto>[] => [
  {
    header: 'Element',
    cell: ({ row }) => row.original.name,
    size: 75,
  },
  {
    header: 'W użyciu',
    cell: ({ row }) => (
      <form.Field
        name={`shipEquipmentsIds`}
        children={(field: AnyFieldApi) => (
          <AppCheckbox
            size="md"
            name={field.name}
            checked={field.state.value.includes(row.original.id)}
            onChange={(enable) =>
              field.handleChange((prev: string[]) =>
                enable ? [...prev, row.original.id] : prev.filter((id: string) => id !== row.original.id)
              )
            }
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            className="grid place-items-center"
            disabled={isReadonly}
          />
        )}
      />
    ),
  },
];

export function FormCShipEquipmentsSection() {
  const { form, formBInitValues, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion
      title="15. Elementy techniczne statku wykorzystywane podczas rejsu"
      expandedByDefault
      data-testid="form-c-ship-equipments-section"
    >
      <form.Field
        name="shipEquipmentsIds"
        children={() => (
          <AppTable
            data={formBInitValues.shipEquipments}
            columns={shipEquipmentColumns(form, hasFormBeenSubmitted, isReadonly)}
            buttons={() => []}
            variant="form"
            disabled={isReadonly}
          />
        )}
      />
    </AppAccordion>
  );
}
