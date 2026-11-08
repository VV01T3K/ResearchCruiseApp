import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { parseCalendarDate, parsePolishDayStart } from '@/lib/dateUtils';
import type { FormBFormApi, FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';
import { ResearchEquipmentValues } from '@/features/applications/schemas/types/ResearchEquipmentValues';

const researchEquipmentsColumns = (
  form: FormBFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<ResearchEquipmentValues>[] => [
  {
    header: 'Lp.',
    cell: ({ row }) => `${row.index + 1}`,
    size: 5,
  },
  {
    header: 'Nazwa sprzętu / aparatury',
    cell: ({ row }) => (
      <form.AppField name={`researchEquipments[${row.index}].name`}>
        {(field) => (
          <field.TextField
            aria-label={`Nazwa sprzętu / aparatury, wiersz ${row.index + 1}`}
            placeholder="Wpisz nazwę sprzętu / aparatury"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
    size: 30,
  },
  {
    header: 'Data zgłoszenia do ubezpieczenia (jeśli zgłoszono)',
    cell: ({ row }) => (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.AppField name={`researchEquipments[${row.index}].insuranceStartDate`}>
          {(field) => (
            <field.DateField
              onChange={(e) => field.handleChange(e ?? '')}
              label="Data rozpoczęcia ubezpieczenia"
              disabled={isReadonly}
            />
          )}
        </form.AppField>
        <form.AppField name={`researchEquipments[${row.index}].insuranceEndDate`}>
          {(field) => (
            <form.Subscribe selector={(state) => state.values.researchEquipments[row.index].insuranceStartDate}>
              {(state) => {
                if (state && field.state.value && parsePolishDayStart(state) > parsePolishDayStart(field.state.value)) {
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
            </form.Subscribe>
          )}
        </form.AppField>
      </div>
    ),
    size: 30,
  },
  {
    header: 'Czy uzyskano zgodę opiekuna?',
    cell: ({ row }) => (
      <form.AppField name={`researchEquipments[${row.index}].permission`}>
        {(field) => (
          <field.CheckboxField
            aria-label={`Zgoda opiekuna, wiersz ${row.index + 1}`}
            size="md"
            className="grid place-items-center"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
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

export function ResearchEquipmentsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { isReadonly } = context;

  return (
    <Accordion title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu" expandedByDefault>
      <form.AppField name="researchEquipments" mode="array">
        {(field) => (
          <Table
            data={field.state.value}
            columns={researchEquipmentsColumns(
              form,
              (index) => {
                field.removeValue(index);
                field.handleBlur();
              },
              isReadonly
            )}
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
      </form.AppField>
    </Accordion>
  );
}
