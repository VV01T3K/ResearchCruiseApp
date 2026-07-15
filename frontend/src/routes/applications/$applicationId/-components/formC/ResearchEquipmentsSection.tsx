import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormCFormApi, FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { ResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentValues';

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
      <form.AppField
        name={`researchEquipments[${row.index}].name`}
        children={(field) => <field.TextField placeholder="Wpisz nazwę sprzętu / aparatury" disabled={isReadonly} />}
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
              selector={(state: { values: FormCValues }) =>
                state.values.researchEquipments[row.index].insuranceStartDate
              }
              children={(insuranceStartDate) => {
                const startDate = insuranceStartDate ?? undefined;
                if (startDate && field.state.value && startDate > field.state.value) {
                  field.handleChange(startDate);
                }
                return (
                  <field.DateField
                    onChange={(e) => field.handleChange(e ?? '')}
                    label="Data zakończenia ubezpieczenia"
                    disabled={isReadonly}
                    selectionStartDate={startDate ? new Date(startDate) : undefined}
                    minimalDate={startDate ? new Date(startDate) : undefined}
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
        <AppTableDeleteRowButton
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
    <AppAccordion
      title="14. Lista sprzętu i aparatury badawczej użytej podczas rejsu"
      expandedByDefault
      data-testid="form-c-research-equipments-section"
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
                field.handleBlur();
              },
              isReadonly
            )}
            buttons={() => [
              <AppButton
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
              </AppButton>,
            ]}
            variant="form"
            disabled={isReadonly}
          />
        )}
      />
    </AppAccordion>
  );
}
