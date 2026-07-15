import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { withForm } from '@/lib/form';
import type { FormBFormApi, FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { ResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentValues';

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
      <form.AppField
        name={`researchEquipments[${row.index}].name`}
        children={(field) => (
          <field.TextField
            data-testid="research-equipment-name-input"
            data-testid-errors="research-equipment-name-errors"
            placeholder="Wpisz nazwę sprzętu / aparatury"
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 30,
  },
  {
    header: 'Data zgłoszenia do ubezpieczenia (jeśli zgłoszono)',
    cell: ({ row }) => (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.AppField
          name={`researchEquipments[${row.index}].insuranceStartDate`}
          children={(field) => (
            <field.DateField
              data-testid="research-equipment-insurance-start"
              onChange={(e) => field.handleChange(e ?? '')}
              label="Data rozpoczęcia ubezpieczenia"
              disabled={isReadonly}
            />
          )}
        />
        <form.AppField
          name={`researchEquipments[${row.index}].insuranceEndDate`}
          children={(field) => (
            <form.Subscribe
              selector={(state) => state.values.researchEquipments[row.index].insuranceStartDate}
              children={(state) => {
                if (state && field.state.value && state > field.state.value) {
                  field.handleChange(state);
                }
                return (
                  <field.DateField
                    data-testid="research-equipment-insurance-end"
                    onChange={(e) => field.handleChange(e ?? '')}
                    label="Data zakończenia ubezpieczenia"
                    disabled={isReadonly}
                    selectionStartDate={state ? new Date(state) : undefined}
                    minimalDate={state ? new Date(state) : undefined}
                  />
                );
              }}
            />
          )}
        />
      </div>
    ),
    size: 30,
  },
  {
    header: 'Czy uzyskano zgodę opiekuna?',
    cell: ({ row }) => (
      <form.AppField
        name={`researchEquipments[${row.index}].permission`}
        children={(field) => (
          <field.CheckboxField size="md" className="grid place-items-center" disabled={isReadonly} />
        )}
      />
    ),
    size: 5,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
      </div>
    ),
    size: 5,
  },
];

export const ResearchEquipmentsSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function ResearchEquipmentsSection({ form, context }) {
    const { isReadonly } = context;

    return (
      <AppAccordion
        title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu"
        expandedByDefault
        data-testid="form-b-research-equipments-section"
      >
        <form.AppField
          name="researchEquipments"
          mode="array"
          children={(field) => (
            <AppTable
              data={field.state.value}
              columns={researchEquipmentsColumns(
                form,
                (index) => {
                  field.removeValue(index);
                  field.handleChange((prev) => prev);
                  field.handleBlur();
                },
                isReadonly
              )}
              buttons={() => [
                <AppButton
                  key="new"
                  data-testid="form-b-add-research-equipment-btn"
                  onClick={() => {
                    field.pushValue({
                      name: '',
                      insuranceStartDate: null,
                      insuranceEndDate: null,
                      permission: false,
                    });
                    field.handleChange((prev: ResearchEquipmentValues[]) => prev);
                    field.handleBlur();
                  }}
                >
                  Dodaj sprzęt / aparaturę
                </AppButton>,
              ]}
              variant="form"
              disabled={isReadonly}
            />
          )}
        />
      </AppAccordion>
    );
  },
});
