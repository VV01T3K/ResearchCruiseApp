import { FieldApi, ReactFormExtendedApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { FormCDto } from '@/cruise-applications/models/FormCDto';
import { LongResearchEquipmentDto } from '@/cruise-applications/models/LongResearchEquipmentDto';
import { PortDto } from '@/cruise-applications/models/PortDto';
import { ShortResearchEquipmentDto } from '@/cruise-applications/models/ShortResearchEquipmentDto';

const shortResearchEquipmentColumns = (
  form: ReactFormExtendedApi<FormCDto, undefined>,
  field: FieldApi<FormCDto, 'shortResearchEquipments', undefined, undefined, ShortResearchEquipmentDto[]>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<ShortResearchEquipmentDto>[] => [
  {
    header: 'Lp.',
    cell: ({ row }) => `${row.index + 1}`,
    size: 10,
  },
  {
    header: 'Od',
    accessorFn: (row) => row.startDate,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`shortResearchEquipments[${row.index}].startDate`}
        children={(field) => (
          <AppDatePickerInput
            name={field.name}
            value={field.state.value}
            onChange={(newValue) => field.handleChange(newValue ?? '')}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Do',
    accessorFn: (row) => row.endDate,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`shortResearchEquipments[${row.index}].endDate`}
        children={(field) => (
          <form.Subscribe
            selector={(state) => state.values.shortResearchEquipments[row.index].startDate}
            children={(state) => {
              if (state && field.state.value && state > field.state.value) {
                field.handleChange(state);
              }
              return (
                <AppDatePickerInput
                  name={field.name}
                  value={field.state.value}
                  onChange={(newValue) => field.handleChange(newValue ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  required
                  disabled={isReadonly}
                  selectionStartDate={state ? new Date(state) : undefined}
                  minimalDate={state ? new Date(state) : undefined}
                />
              );
            }}
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Nazwa sprzętu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`shortResearchEquipments[${row.index}].name`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa sprzętu"
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
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
    size: 10,
  },
];

const longResearchEquipmentColumns = (
  form: ReactFormExtendedApi<FormCDto, undefined>,
  field: FieldApi<FormCDto, 'longResearchEquipments', undefined, undefined, LongResearchEquipmentDto[]>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<LongResearchEquipmentDto>[] => [
  {
    header: 'Lp.',
    cell: ({ row }) => `${row.index + 1}`,
    size: 10,
  },
  {
    header: 'Czynność',
    accessorFn: (row) => row.action,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`longResearchEquipments[${row.index}].action`}
        children={(field) => (
          <AppDropdownInput
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e as LongResearchEquipmentDto['action'])}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            allOptions={[
              { value: 'Put', inlineLabel: 'Pozostawienie' },
              { value: 'Collect', inlineLabel: 'Zabranie' },
            ]}
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Czas (pora dnia, przedział czasu itp.)',
    accessorFn: (row) => row.duration,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`longResearchEquipments[${row.index}].duration`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Czas"
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Nazwa sprzętu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`longResearchEquipments[${row.index}].name`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa sprzętu"
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
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
    size: 10,
  },
];

const portColumns = (
  form: ReactFormExtendedApi<FormCDto, undefined>,
  field: FieldApi<FormCDto, 'ports', undefined, undefined, PortDto[]>,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean
): ColumnDef<PortDto>[] => [
  {
    header: 'Lp.',
    cell: ({ row }) => `${row.index + 1}`,
    size: 10,
  },
  {
    header: 'Wejście',
    accessorFn: (row) => row.startTime,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`ports[${row.index}].startTime`}
        children={(field) => (
          <AppDatePickerInput
            name={field.name}
            value={field.state.value}
            onChange={(newValue) => field.handleChange(newValue ?? '')}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            required
            disabled={isReadonly}
            type="datetime"
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Wyjście',
    accessorFn: (row) => row.endTime,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`ports[${row.index}].endTime`}
        children={(field) => (
          <form.Subscribe
            selector={(state) => state.values.ports[row.index].startTime}
            children={(state) => {
              if (state > field.state.value && field.state.value !== '') {
                field.handleChange(state);
              }
              return (
                <AppDatePickerInput
                  name={field.name}
                  value={field.state.value}
                  onChange={(newValue) => field.handleChange(newValue ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  required
                  disabled={isReadonly}
                  type="datetime"
                  selectionStartDate={state ? new Date(state) : undefined}
                  minimalDate={state ? new Date(state) : undefined}
                />
              );
            }}
          />
        )}
      />
    ),
    size: 20,
  },
  {
    header: 'Nazwa portu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.Field
        name={`ports[${row.index}].name`}
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa portu"
            required
            disabled={isReadonly}
          />
        )}
      />
    ),
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
    size: 10,
  },
];

export function FormCCruiseDetailsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion title="12. Szczegóły rejsu" expandedByDefault>
      <p className="text-xl text-center font-semibold">Czy w ramach rejsu wystąpiło:</p>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wystawienie sprzętu</p>
        <form.Field
          name="shortResearchEquipments"
          mode="array"
          children={(field) => (
            <AppTable
              columns={shortResearchEquipmentColumns(form, field, hasFormBeenSubmitted, isReadonly)}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="new"
                  onClick={() => {
                    field.pushValue({
                      startDate: '',
                      endDate: '',
                      name: '',
                    });
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  }}
                >
                  Dodaj sprzęt
                </AppButton>,
              ]}
              variant="form"
              disabled={isReadonly}
            />
          )}
        />
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold">Pozostawienie lub zabranie sprzętu</p>
        <form.Field
          name="longResearchEquipments"
          mode="array"
          children={(field) => (
            <AppTable
              columns={longResearchEquipmentColumns(form, field, hasFormBeenSubmitted, isReadonly)}
              data={field.state.value}
              buttons={() => [
                <CruiseApplicationDropdownElementSelectorButton
                  key="new"
                  options={[
                    { value: 'Put', label: 'Pozostawienie' },
                    { value: 'Collect', label: 'Zabranie' },
                  ].map((option) => ({
                    value: option.label,
                    onClick: () => {
                      field.pushValue({
                        action: option.value as LongResearchEquipmentDto['action'],
                        duration: '',
                        name: '',
                      });
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                    },
                  }))}
                  variant="primary"
                  disabled={isReadonly}
                >
                  Dodaj nowe
                </CruiseApplicationDropdownElementSelectorButton>,
              ]}
              variant="form"
              disabled={isReadonly}
            />
          )}
        />
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wchodzenie lub wychodzenie z portu</p>
        <form.Field
          name="ports"
          mode="array"
          children={(field) => (
            <AppTable
              columns={portColumns(form, field, hasFormBeenSubmitted, isReadonly)}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="new"
                  onClick={() => {
                    field.pushValue({
                      startTime: '',
                      endTime: '',
                      name: '',
                    });
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  }}
                >
                  Dodaj port
                </AppButton>,
              ]}
              variant="form"
              disabled={isReadonly}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
