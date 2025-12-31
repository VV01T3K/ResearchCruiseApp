import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { FormBContextType, useFormB } from '@/cruise-applications/contexts/FormBContext';
import { ResearchEquipmentDto } from '@/cruise-applications/models/ResearchEquipmentDto';

const researchEquipmentsColumns = (
  form: FormBContextType['form'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<ResearchEquipmentDto>[] => [
  {
    header: 'Lp.',
    cell: ({ row }) => `${row.index + 1}`,
    size: 5,
  },
  {
    header: 'Nazwa sprzętu / aparatury',
    cell: ({ row }) => (
      <form.Field
        name={`researchEquipments[${row.index}].name`}
        children={(field) => (
          <AppInput
            data-testid="research-equipment-name"
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
        <form.Field
          name={`researchEquipments[${row.index}].insuranceStartDate`}
          children={(field) => (
            <AppDatePickerInput
              data-testid="research-equipment-insurance-start"
              name={field.name}
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e ?? '')}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Data rozpoczęcia ubezpieczenia"
              disabled={isReadonly}
            />
          )}
        />
        <form.Field
          name={`researchEquipments[${row.index}].insuranceEndDate`}
          children={(field) => (
            <form.Subscribe
              selector={(state) => state.values.researchEquipments[row.index].insuranceStartDate}
              children={(state) => {
                if (state && field.state.value && state > field.state.value) {
                  field.handleChange(state);
                }
                return (
                  <AppDatePickerInput
                    data-testid="research-equipment-insurance-end"
                    name={field.name}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e ?? '')}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
      <form.Field
        name={`researchEquipments[${row.index}].permission`}
        children={(field) => (
          <AppCheckbox
            size="md"
            name={field.name}
            checked={field.state.value === 'true'}
            onChange={(value) => field.handleChange(value ? 'true' : 'false')}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            className="grid place-items-center"
            disabled={isReadonly}
          />
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
            field.removeValue(row.index);
            field.handleChange((prev: ResearchEquipmentDto[]) => prev);
            field.handleBlur();
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 5,
  },
];

export function FormBResearchEquipmentsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormB();

  return (
    <AppAccordion
      title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu"
      expandedByDefault
      data-testid="form-b-research-equipments-section"
    >
      <form.Field
        name="researchEquipments"
        mode="array"
        children={(field) => (
          <AppTable
            data={field.state.value}
            columns={researchEquipmentsColumns(form, field, hasFormBeenSubmitted, isReadonly)}
            buttons={() => [
              <AppButton
                key="new"
                data-testid="form-b-add-research-equipment-btn"
                onClick={() => {
                  field.pushValue({
                    name: '',
                    insuranceStartDate: null,
                    insuranceEndDate: null,
                    permission: 'false',
                  });
                  field.handleChange((prev: ResearchEquipmentDto[]) => prev);
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
