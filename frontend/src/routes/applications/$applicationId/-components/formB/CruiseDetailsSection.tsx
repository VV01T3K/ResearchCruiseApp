import { ColumnDef } from '@/integrations/tanstack/table/features';
import { useState } from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBFormApi, FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { LongResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import { PortCallValues } from '@/routes/applications/$applicationId/-schemas/types/PortCallValues';
import { ShortResearchEquipmentValues } from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentValues';

const shortResearchEquipmentColumns = (
  form: FormBFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean,
  allowPastDates: boolean
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
      <form.AppField
        name={`shortResearchEquipments[${row.index}].startDate`}
        listeners={{
          onChange: ({ value }) => {
            const endDate = form.getFieldValue(`shortResearchEquipments[${row.index}].endDate`);
            if (value && endDate && value > endDate) {
              form.setFieldValue(`shortResearchEquipments[${row.index}].endDate`, value);
            }
          },
        }}
      >
        {(field) => <field.DateField disabled={isReadonly} minimalDate={allowPastDates ? undefined : new Date()} />}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Do',
    accessorFn: (row) => row.endDate,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`shortResearchEquipments[${row.index}].endDate`}>
        {(field) => (
          <form.Subscribe selector={(state) => state.values.shortResearchEquipments[row.index].startDate}>
            {(startDate) => (
              <field.DateField
                disabled={isReadonly}
                selectionStartDate={startDate ? new Date(startDate) : undefined}
                minimalDate={startDate ? new Date(startDate) : undefined}
              />
            )}
          </form.Subscribe>
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Nazwa sprzętu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`shortResearchEquipments[${row.index}].name`}>
        {(field) => <field.TextField placeholder="Nazwa sprzętu" disabled={isReadonly} />}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
      </div>
    ),
    size: 10,
  },
];

const longResearchEquipmentColumns = (
  form: FormBFormApi,
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
      <form.AppField name={`longResearchEquipments[${row.index}].action`}>
        {(field) => (
          <field.SelectField
            disabled={isReadonly}
            allOptions={[
              { value: 'Put', inlineLabel: 'Pozostawienie' },
              { value: 'Collect', inlineLabel: 'Zabranie' },
            ]}
          />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Czas (pora dnia, przedział czasu itp.)',
    accessorFn: (row) => row.duration,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`longResearchEquipments[${row.index}].duration`}>
        {(field) => <field.TextField placeholder="Czas" disabled={isReadonly} />}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Nazwa sprzętu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`longResearchEquipments[${row.index}].name`}>
        {(field) => <field.TextField placeholder="Nazwa sprzętu" disabled={isReadonly} />}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
      </div>
    ),
    size: 10,
  },
];

const portColumns = (
  form: FormBFormApi,
  removeRow: (index: number) => void,
  isReadonly: boolean,
  allowPastDates: boolean
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
      <form.AppField
        name={`ports[${row.index}].startTime`}
        listeners={{
          onChange: ({ value }) => {
            const endTime = form.getFieldValue(`ports[${row.index}].endTime`);
            if (value && endTime && value > endTime) {
              form.setFieldValue(`ports[${row.index}].endTime`, value);
            }
          },
        }}
      >
        {(field) => (
          <field.DateField
            disabled={isReadonly}
            type="datetime"
            minimalDate={allowPastDates ? undefined : new Date()}
          />
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Wyjście',
    accessorFn: (row) => row.endTime,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`ports[${row.index}].endTime`}>
        {(field) => (
          <form.Subscribe selector={(state) => state.values.ports[row.index].startTime}>
            {(startTime) => (
              <field.DateField
                disabled={isReadonly}
                type="datetime"
                selectionStartDate={startTime ? new Date(startTime) : undefined}
                minimalDate={startTime ? new Date(startTime) : undefined}
              />
            )}
          </form.Subscribe>
        )}
      </form.AppField>
    ),
    size: 20,
  },
  {
    header: 'Nazwa portu',
    accessorFn: (row) => row.name,
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <form.AppField name={`ports[${row.index}].name`}>
        {(field) => <field.TextField placeholder="Nazwa portu" disabled={isReadonly} />}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />
      </div>
    ),
    size: 10,
  },
];

export function CruiseDetailsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { isReadonly } = context;

  const [includeShortResearchEquipments, setIncludeShortResearchEquipments] = useState(false);
  const [includePorts, setIncludePorts] = useState(false);

  return (
    <AppAccordion title="12. Szczegóły rejsu" expandedByDefault>
      <p className="text-center text-xl font-semibold">Czy w ramach rejsu planuje się:</p>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wystawienie sprzętu</p>

        <form.AppField name="shortResearchEquipments" mode="array">
          {(field) => (
            <AppTable
              columns={shortResearchEquipmentColumns(
                form,
                (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
                isReadonly,
                includeShortResearchEquipments
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
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.shortResearchEquipments}>
          {(shortEquipments) => (
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
        </form.Subscribe>
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold">Pozostawienie lub zabranie sprzętu</p>
        <form.AppField name="longResearchEquipments" mode="array">
          {(field) => (
            <AppTable
              columns={longResearchEquipmentColumns(
                form,
                (index) => {
                  field.removeValue(index);
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
        </form.AppField>
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wchodzenie lub wychodzenie z portu</p>

        <form.AppField name="ports" mode="array">
          {(field) => (
            <AppTable
              columns={portColumns(
                form,
                (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
                isReadonly,
                includePorts
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
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.ports}>
          {(ports) => (
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
        </form.Subscribe>
      </div>
    </AppAccordion>
  );
}
