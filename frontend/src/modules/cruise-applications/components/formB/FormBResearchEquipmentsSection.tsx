import { FieldApi, ReactFormExtendedApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { ResearchEquipmentDto } from '@/cruise-applications/models/ResearchEquipmentDto';

const researchEquipmentsColumns = (
  form: ReactFormExtendedApi<FormBDto, undefined>,
  field: FieldApi<FormBDto, 'researchEquipments', undefined, undefined, ResearchEquipmentDto[]>,
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
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Wpisz nazwę sprzętu / aparatury"
            required
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
            <AppDatePickerInput
              name={field.name}
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e ?? '')}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Data zakończenia ubezpieczenia"
              disabled={isReadonly}
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
            field.handleChange((prev) => prev);
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
    <AppAccordion title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu" expandedByDefault>
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
