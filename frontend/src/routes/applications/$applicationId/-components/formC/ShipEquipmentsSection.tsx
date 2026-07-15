import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppTable } from '@/components/shared/table/AppTable';
import { withForm } from '@/lib/form';
import type { FormCFormApi, FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { ShipEquipmentOption } from '@/routes/applications/$applicationId/-schemas/types/ShipEquipmentOption';

const shipEquipmentColumns = (form: FormCFormApi, isReadonly: boolean): ColumnDef<ShipEquipmentOption>[] => [
  {
    header: 'Element',
    cell: ({ row }) => row.original.name,
    size: 75,
  },
  {
    header: 'W użyciu',
    cell: ({ row }) => (
      <form.AppField
        name={`shipEquipmentsIds`}
        children={(field) => (
          <field.ArrayCheckboxField
            item={row.original.id}
            size="md"
            className="grid place-items-center"
            disabled={isReadonly}
          />
        )}
      />
    ),
  },
];

export const ShipEquipmentsSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function ShipEquipmentsSection({ form, context }) {
    const { formBInitValues, isReadonly } = context;

    return (
      <AppAccordion
        title="15. Elementy techniczne statku wykorzystywane podczas rejsu"
        expandedByDefault
        data-testid="form-c-ship-equipments-section"
      >
        <form.AppField
          name="shipEquipmentsIds"
          children={() => (
            <AppTable
              data={formBInitValues.shipEquipments}
              columns={shipEquipmentColumns(form, isReadonly)}
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
