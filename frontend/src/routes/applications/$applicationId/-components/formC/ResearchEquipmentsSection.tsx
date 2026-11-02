import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { parseCalendarDate, parsePolishDayStart } from '@/lib/dateUtils';
import type { FormCFormApi, FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import type { FormCValues } from '@/features/applications/schemas/formC.schema';
import { ResearchEquipmentValues } from '@/features/applications/schemas/types/ResearchEquipmentValues';

const researchEquipmentsColumns = (
  form: FormCFormApi,
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
        {(field) => <field.TextField placeholder="Wpisz nazwę sprzętu / aparatury" disabled={isReadonly} />}
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
            <form.Subscribe
              selector={(state: { values: FormCValues }) =>
                state.values.researchEquipments[row.index].insuranceStartDate
              }
            >
              {(insuranceStartDate) => {
                const startDate = insuranceStartDate ?? undefined;
                if (
                  startDate &&
                  field.state.value &&
                  parsePolishDayStart(startDate) > parsePolishDayStart(field.state.value)
                ) {
                  field.handleChange(startDate);
                }
                return (
                  <field.DateField
                    onChange={(e) => field.handleChange(e ?? '')}
                    label="Data zakończenia ubezpieczenia"
                    disabled={isReadonly}
                    selectionStartDate={startDate ? parseCalendarDate(startDate) : undefined}
                    minimalDate={startDate ? parseCalendarDate(startDate) : undefined}
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
        {(field) => <field.CheckboxField size="md" className="grid place-items-center" disabled={isReadonly} />}
      </form.AppField>
    ),
    size: 5,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TableDeleteRowButton
          onClick={() => {
            removeRow(row.index);
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 5,
  },
];

export function ResearchEquipmentsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;

  return (
    <Accordion title="14. Lista sprzętu i aparatury badawczej użytej podczas rejsu" expandedByDefault>
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
            variant="form"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    </Accordion>
  );
}
