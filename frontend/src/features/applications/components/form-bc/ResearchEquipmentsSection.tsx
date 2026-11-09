import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { withFieldGroup } from '@/integrations/tanstack/form/hook';
import { parseCalendarDate, parsePolishDayStart } from '@/lib/dateUtils';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { ResearchEquipmentValues } from '@/features/applications/schemas/types/ResearchEquipmentValues';

export const ResearchEquipmentsSection = withFieldGroup({
  defaultValues: { researchEquipments: [] as ResearchEquipmentValues[] },
  props: {} as { title: string; context: Pick<FormBViewModel, 'isReadonly'> },
  render: function Render({ group, title, context }) {
    const { isReadonly } = context;

    function getColumns(removeRow: (index: number) => void): ColumnDef<ResearchEquipmentValues>[] {
      return [
        {
          header: 'Lp.',
          cell: ({ row }) => `${row.index + 1}`,
          size: 5,
        },
        {
          header: 'Nazwa sprzętu / aparatury',
          cell: ({ row }) => (
            <group.AppField name={`researchEquipments[${row.index}].name`}>
              {(field) => (
                <field.TextField
                  aria-label={`Nazwa sprzętu / aparatury, wiersz ${row.index + 1}`}
                  placeholder="Wpisz nazwę sprzętu / aparatury"
                  disabled={isReadonly}
                />
              )}
            </group.AppField>
          ),
          size: 30,
        },
        {
          header: 'Data zgłoszenia do ubezpieczenia (jeśli zgłoszono)',
          cell: ({ row }) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <group.AppField name={`researchEquipments[${row.index}].insuranceStartDate`}>
                {(field) => (
                  <field.DateField
                    onChange={(e) => field.handleChange(e ?? '')}
                    label="Data rozpoczęcia ubezpieczenia"
                    disabled={isReadonly}
                  />
                )}
              </group.AppField>
              <group.AppField name={`researchEquipments[${row.index}].insuranceEndDate`}>
                {(field) => (
                  <group.Subscribe selector={(state) => state.values.researchEquipments[row.index].insuranceStartDate}>
                    {(state) => {
                      if (
                        state &&
                        field.state.value &&
                        parsePolishDayStart(state) > parsePolishDayStart(field.state.value)
                      ) {
                        field.handleChange(state);
                      }
                      return (
                        <field.DateField
                          onChange={(e) => field.handleChange(e ?? '')}
                          label="Data zakończenia ubezpieczenia"
                          disabled={isReadonly}
                          selectionStartDate={state ? parseCalendarDate(state) : undefined}
                          minimalDate={state ? parseCalendarDate(state) : undefined}
                        />
                      );
                    }}
                  </group.Subscribe>
                )}
              </group.AppField>
            </div>
          ),
          size: 30,
        },
        {
          header: 'Czy uzyskano zgodę opiekuna?',
          cell: ({ row }) => (
            <group.AppField name={`researchEquipments[${row.index}].permission`}>
              {(field) => (
                <field.CheckboxField
                  aria-label={`Zgoda opiekuna, wiersz ${row.index + 1}`}
                  size="md"
                  className="grid place-items-center"
                  disabled={isReadonly}
                />
              )}
            </group.AppField>
          ),
          size: 5,
        },
        {
          id: 'actions',
          header: () => <span className="sr-only">Akcje</span>,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <TableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
            </div>
          ),
          size: 5,
        },
      ];
    }

    return (
      <Accordion title={title} expandedByDefault>
        <group.AppField name="researchEquipments" mode="array">
          {(field) => (
            <Table
              data={field.state.value}
              columns={getColumns((index) => {
                field.removeValue(index);
                field.handleBlur();
              })}
              buttons={() => [
                <Button
                  key="new"
                  onClick={() => {
                    field.pushValue({
                      name: '',
                      insuranceStartDate: null,
                      insuranceEndDate: null,
                      permission: false,
                    });
                    field.handleBlur();
                  }}
                >
                  Dodaj sprzęt / aparaturę
                </Button>,
              ]}
              disabled={isReadonly}
            />
          )}
        </group.AppField>
      </Accordion>
    );
  },
});
