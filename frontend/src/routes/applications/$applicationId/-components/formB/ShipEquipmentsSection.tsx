import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBFormApi, FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';
import { ShipEquipmentOption } from '@/api/generated/schemas';

const shipEquipmentColumns = (form: FormBFormApi, isReadonly: boolean): ColumnDef<ShipEquipmentOption>[] => [
  {
    header: 'Element',
    cell: ({ row }) => row.original.name,
    size: 75,
  },
  {
    header: 'W użyciu',
    cell: ({ row }) => (
      <form.AppField name={`shipEquipmentsIds`}>
        {(field) => (
          <field.ArrayCheckboxField
            item={row.original.id}
            size="md"
            className="grid place-items-center"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
  },
];

export function ShipEquipmentsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { formBInitValues, isReadonly } = context;

  return (
    <Accordion title="15. Elementy techniczne statku wykorzystywane podczas rejsu" expandedByDefault>
      <form.AppField name="shipEquipmentsIds">
        {() => (
          <Table
            data={formBInitValues.shipEquipments}
            columns={shipEquipmentColumns(form, isReadonly)}
            buttons={() => []}
            variant="form"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    </Accordion>
  );
}
