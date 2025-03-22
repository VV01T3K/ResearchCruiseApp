import { ReactFormExtendedApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppTable } from '@/core/components/table/AppTable';
import { getErrors } from '@/core/lib/utils';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { ShipEquipmentDto } from '@/cruise-applications/models/ShipEquipmentDto';

const shipEquipmentColumns = (
  form: ReactFormExtendedApi<FormBDto, undefined>,
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
    <AppAccordion title="15. Elementy techniczne statku wykorzystywane podczas rejsu" expandedByDefault>
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
