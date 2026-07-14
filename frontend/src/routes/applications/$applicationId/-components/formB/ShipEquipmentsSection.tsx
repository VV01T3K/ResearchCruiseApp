import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { getErrors } from '@/lib/utils';
import { withForm } from '@/lib/form';
import type { FormBFormApi, FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { ShipEquipmentOption } from '@/routes/applications/$applicationId/-schemas/types/ShipEquipmentOption';

const shipEquipmentColumns = (
  form: FormBFormApi,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<ShipEquipmentOption>[] => [
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

export const ShipEquipmentsSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function ShipEquipmentsSection({ form, context }) {
    const { formBInitValues, hasFormBeenSubmitted, isReadonly } = context;

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
  },
});
