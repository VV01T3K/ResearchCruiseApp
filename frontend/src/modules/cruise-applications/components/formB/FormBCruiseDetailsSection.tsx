import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { FormBContextType, useFormB } from '@/cruise-applications/contexts/FormBContext';
import { LongResearchEquipmentDto } from '@/cruise-applications/models/LongResearchEquipmentDto';
import { PortDto } from '@/cruise-applications/models/PortDto';
import { ShortResearchEquipmentDto } from '@/cruise-applications/models/ShortResearchEquipmentDto';

const shortResearchEquipmentColumns = (
  form: FormBContextType['form'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean,
  allowPastDates: boolean
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
        listeners={{
          onChange: ({ value }) => {
            const endDate = form.getFieldValue(`shortResearchEquipments[${row.index}].endDate`);
            if (value && endDate && value > endDate) {
              form.setFieldValue(`shortResearchEquipments[${row.index}].endDate`, value);
            }
          },
        }}
        children={(field) => (
          <AppDatePickerInput
            data-testid-button="short-equipment-from-button"
            data-testid-errors="short-equipment-from-errors"
            name={field.name}
            value={field.state.value}
            onChange={(newValue) => field.handleChange(newValue ?? '')}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            minimalDate={allowPastDates ? undefined : new Date()}
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
            children={(startDate) => (
              <AppDatePickerInput
                data-testid-button="short-equipment-to-button"
                data-testid-errors="short-equipment-to-errors"
                name={field.name}
                value={field.state.value}
                onChange={(newValue) => field.handleChange(newValue ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                disabled={isReadonly}
                selectionStartDate={startDate ? new Date(startDate) : undefined}
                minimalDate={startDate ? new Date(startDate) : undefined}
              />
            )}
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
            data-testid="short-equipment-name-input"
            data-testid-errors="short-equipment-name-errors"
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa sprzętu"
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
            field.handleChange((prev: ShortResearchEquipmentDto[]) => prev);
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
  form: FormBContextType['form'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any,
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
            data-testid="long-equipment-duration-input"
            data-testid-errors="long-equipment-duration-errors"
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Czas"
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
            data-testid="long-equipment-name-input"
            data-testid-errors="long-equipment-name-errors"
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa sprzętu"
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
            field.handleChange((prev: LongResearchEquipmentDto[]) => prev);
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
  form: FormBContextType['form'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any,
  hasFormBeenSubmitted: boolean,
  isReadonly: boolean,
  allowPastDates: boolean
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
        listeners={{
          onChange: ({ value }) => {
            const endTime = form.getFieldValue(`ports[${row.index}].endTime`);
            if (value && endTime && value > endTime) {
              form.setFieldValue(`ports[${row.index}].endTime`, value);
            }
          },
        }}
        children={(field) => (
          <AppDatePickerInput
            data-testid-button="port-from-button"
            data-testid-errors="port-from-errors"
            name={field.name}
            value={field.state.value}
            onChange={(newValue) => field.handleChange(newValue ?? '')}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            type="datetime"
            minimalDate={allowPastDates ? undefined : new Date()}
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
            children={(startTime) => (
              <AppDatePickerInput
                data-testid-button="port-to-button"
                data-testid-errors="port-to-errors"
                name={field.name}
                value={field.state.value}
                onChange={(newValue) => field.handleChange(newValue ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                disabled={isReadonly}
                type="datetime"
                selectionStartDate={startTime ? new Date(startTime) : undefined}
                minimalDate={startTime ? new Date(startTime) : undefined}
              />
            )}
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
            data-testid="port-name-input"
            data-testid-errors="port-name-errors"
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Nazwa portu"
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
            field.handleChange((prev: PortDto[]) => prev);
            field.handleBlur();
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

export function FormBCruiseDetailsSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormB();

  const [includeShortResearchEquipments, setIncludeShortResearchEquipments] = useState(false);
  const [includePorts, setIncludePorts] = useState(false);

  return (
    <AppAccordion title="12. Szczegóły rejsu" expandedByDefault data-testid="form-b-cruise-details-section">
      <p className="text-center text-xl font-semibold">Czy w ramach rejsu planuje się:</p>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wystawienie sprzętu</p>

        <form.Field
          name="shortResearchEquipments"
          mode="array"
          children={(field) => (
            <AppTable
              columns={shortResearchEquipmentColumns(
                form,
                field,
                hasFormBeenSubmitted,
                isReadonly,
                includeShortResearchEquipments
              )}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="new"
                  data-testid="form-b-add-short-equipment-btn"
                  onClick={() => {
                    field.pushValue({
                      startDate: '',
                      endDate: '',
                      name: '',
                    });
                    field.handleChange((prev: ShortResearchEquipmentDto[]) => prev);
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
        <form.Subscribe
          selector={(state) => state.values.shortResearchEquipments}
          children={(shortEquipments) => (
            <>
              {!isReadonly && shortEquipments.length > 0 && (
                <AppCheckbox
                  name="includeShortResearchEquipments"
                  checked={includeShortResearchEquipments}
                  onChange={setIncludeShortResearchEquipments}
                  label="Zezwól na wybór dat z przeszłości"
                />
              )}
            </>
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
                  data-testid="form-b-add-long-equipment-btn"
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
                      field.handleChange((prev: LongResearchEquipmentDto[]) => prev);
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
              columns={portColumns(form, field, hasFormBeenSubmitted, isReadonly, includePorts)}
              data={field.state.value}
              buttons={() => [
                <AppButton
                  key="new"
                  data-testid="form-b-add-port-btn"
                  onClick={() => {
                    field.pushValue({
                      startTime: '',
                      endTime: '',
                      name: '',
                    });
                    field.handleChange((prev: PortDto[]) => prev);
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
        <form.Subscribe
          selector={(state) => state.values.ports}
          children={(ports) => (
            <>
              {!isReadonly && ports.length > 0 && (
                <AppCheckbox
                  name="includePorts"
                  checked={includePorts}
                  onChange={setIncludePorts}
                  label="Zezwól na wybór dat z przeszłości"
                />
              )}
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
