import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { withForm } from '@/lib/form';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import type { FormCFormApi, FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { LongResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import { PortCallValues } from '@/routes/applications/$applicationId/-schemas/types/PortCallValues';
import { ShortResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentValues';

const shortResearchEquipmentColumns = (
  form: FormCFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<ShortResearchEquipmentValues>[] => [
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
            errors={getErrors(field.state.meta)}
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
                  errors={getErrors(field.state.meta)}
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
            errors={getErrors(field.state.meta)}
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
            removeRow(row.index);
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

const longResearchEquipmentColumns = (
  form: FormCFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<LongResearchEquipmentValues>[] => [
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
            onChange={(e) => field.handleChange(e as LongResearchEquipmentValues['action'])}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta)}
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
            errors={getErrors(field.state.meta)}
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
            name={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta)}
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
            removeRow(row.index);
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

const portColumns = (
  form: FormCFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean
): ColumnDef<PortCallValues>[] => [
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
            errors={getErrors(field.state.meta)}
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
                  errors={getErrors(field.state.meta)}
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
            errors={getErrors(field.state.meta)}
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
            removeRow(row.index);
          }}
          disabled={isReadonly}
        />
      </div>
    ),
    size: 10,
  },
];

export const CruiseDetailsSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function CruiseDetailsSection({ form, context }) {
    const { isReadonly } = context;

    return (
      <AppAccordion title="12. Szczegóły rejsu" expandedByDefault data-testid="form-c-cruise-details-section">
        <p className="text-center text-xl font-semibold">Czy w ramach rejsu wystąpiło:</p>

        <div className="mt-8">
          <p className="text-lg font-semibold">Wystawienie sprzętu</p>
          <form.Field
            name="shortResearchEquipments"
            mode="array"
            children={(field) => (
              <AppTable
                columns={shortResearchEquipmentColumns(
                  form,
                  (index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  },
                  isReadonly
                )}
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
                      field.handleChange((prev: ShortResearchEquipmentValues[]) => prev);
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
                columns={longResearchEquipmentColumns(
                  form,
                  (index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  },
                  isReadonly
                )}
                data={field.state.value}
                buttons={() => [
                  <DropdownElementSelectorButton
                    key="new"
                    options={[
                      { value: 'Put', label: 'Pozostawienie' },
                      { value: 'Collect', label: 'Zabranie' },
                    ].map((option) => ({
                      value: option.label,
                      onClick: () => {
                        field.pushValue({
                          action: option.value as LongResearchEquipmentValues['action'],
                          duration: '',
                          name: '',
                        });
                        field.handleChange((prev: LongResearchEquipmentValues[]) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nowe
                  </DropdownElementSelectorButton>,
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
                columns={portColumns(
                  form,
                  (index) => {
                    field.removeValue(index);
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                  },
                  isReadonly
                )}
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
                      field.handleChange((prev: PortCallValues[]) => prev);
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
  },
});
