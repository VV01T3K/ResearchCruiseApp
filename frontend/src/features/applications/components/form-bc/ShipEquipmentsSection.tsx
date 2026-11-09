import type { ShipEquipmentOption } from '@/api/generated/schemas';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { Accordion } from '@/components/shared/Accordion';
import { Table } from '@/components/shared/table/Table';
import { withFieldGroup } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';

export const ShipEquipmentsSection = withFieldGroup({
  defaultValues: { shipEquipmentsIds: [] as string[] },
  props: {} as { context: Pick<FormBViewModel, 'formBInitValues' | 'isReadonly'> },
  render: function Render({ group, context }) {
    'use memo';
    const { formBInitValues, isReadonly } = context;
    const columns: ColumnDef<ShipEquipmentOption>[] = [
      {
        header: 'Element',
        cell: ({ row }) => row.original.name,
        size: 75,
      },
      {
        header: 'W użyciu',
        cell: ({ row }) => (
          <group.AppField name={`shipEquipmentsIds`}>
            {(field) => (
              <field.CheckboxField
                checked={field.state.value.includes(row.original.id)}
                onChange={(checked) =>
                  field.handleChange((ids) =>
                    checked ? [...ids, row.original.id] : ids.filter((id) => id !== row.original.id)
                  )
                }
                aria-label={`W użyciu: ${row.original.name}`}
                size="md"
                className="grid place-items-center"
                disabled={isReadonly}
              />
            )}
          </group.AppField>
        ),
      },
    ];

    return (
      <Accordion title="15. Elementy techniczne statku wykorzystywane podczas rejsu" expandedByDefault>
        <group.AppField name="shipEquipmentsIds">
          {() => (
            <Table data={formBInitValues.shipEquipments} columns={columns} buttons={() => []} disabled={isReadonly} />
          )}
        </group.AppField>
      </Accordion>
    );
  },
});
