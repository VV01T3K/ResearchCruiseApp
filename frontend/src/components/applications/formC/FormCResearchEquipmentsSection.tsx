import type { AnyFieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { AnyReactFormApi } from '@/lib/form';
import { getErrors } from '@/lib/utils';
import { useFormC } from '@/contexts/applications/FormCContext';
import { FormCDto } from '@/api/dto/applications/FormCDto';
import { ResearchEquipmentDto } from '@/api/dto/applications/ResearchEquipmentDto';

const researchEquipmentsColumns = (
  form: AnyReactFormApi<FormCDto>,
  field: AnyFieldApi,
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
        children={(field: AnyFieldApi) => (
          <AppInput
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
          children={(field: AnyFieldApi) => (
            <AppDatePickerInput
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
          children={(field: AnyFieldApi) => (
            <form.Subscribe
              selector={(state: { values: FormCDto }) => state.values.researchEquipments[row.index].insuranceStartDate}
              children={(insuranceStartDate) => {
                const startDate = insuranceStartDate ?? undefined;
                if (startDate && field.state.value && startDate > field.state.value) {
                  field.handleChange(startDate);
                }
                return (
                  <AppDatePickerInput
                    name={field.name}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e ?? '')}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
      <form.Field
        name={`researchEquipments[${row.index}].permission`}
        children={(field: AnyFieldApi) => (
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

export function FormCResearchEquipmentsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion
      title="14. Lista sprzętu i aparatury badawczej użytej podczas rejsu"
      expandedByDefault
      data-testid="form-c-research-equipments-section"
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
                onClick={() => {
                  field.pushValue({
                    name: '',
                    insuranceStartDate: null,
                    insuranceEndDate: null,
                    permission: 'false',
                  });
                  field.handleChange((prev) => prev);
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
