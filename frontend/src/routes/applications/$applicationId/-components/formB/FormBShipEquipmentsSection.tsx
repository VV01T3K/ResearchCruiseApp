import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { getErrors } from '@/lib/utils';
import { FormBContextType, useFormB } from '@/contexts/applications/FormBContext';
import { ShipEquipmentDto } from '@/api/dto/applications/ShipEquipmentDto';

const shipEquipmentColumns = (
  form: FormBContextType['form'],
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
        children={(field) => (
          <AppCheckbox
            size="md"
            name={field.name}
            checked={field.state.value.includes(row.original.id)}
            onChange={(enable) =>
              field.handleChange((prev) =>
                enable ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)
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

export function FormBShipEquipmentsSection() {
  const { form, formBInitValues, hasFormBeenSubmitted, isReadonly } = useFormB();

  return (
    <AppAccordion
      title="15. Elementy techniczne statku wykorzystywane podczas rejsu"
      expandedByDefault
      data-testid="form-b-ship-equipments-section"
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
