import { ColumnDef } from '@/integrations/tanstack/table/features';
import { useState } from 'react';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { Table } from '@/components/shared/table/Table';
import { ActionsHeader, DeleteRowCell } from '@/integrations/tanstack/table/DeleteRowCell';
import { AddMenuButton } from '@/features/applications/components/form-controls/AddMenuButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { parseCalendarDate, parsePolishDayStart } from '@/lib/dateUtils';
import type { FormBFormApi, FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';
import { LongResearchEquipmentValues } from '@/features/applications/schemas/types/LongResearchEquipmentValues';
import { PortCallValues } from '@/features/applications/schemas/types/PortCallValues';
import { ShortResearchEquipmentValues } from '@/features/applications/schemas/types/ShortResearchEquipmentValues';

const shortResearchEquipmentColumns = (
  form: FormBFormApi,
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
            if (value && endDate && parsePolishDayStart(value) > parsePolishDayStart(endDate)) {
              form.setFieldValue(`shortResearchEquipments[${row.index}].endDate`, value);
            }
          },
        }}
      >
        {(field) => (
          <field.DateField
            aria-label="Od"
            disabled={isReadonly}
            minimalDate={allowPastDates ? undefined : new Date()}
          />
        )}
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
                aria-label="Do"
                disabled={isReadonly}
                selectionStartDate={startDate ? parseCalendarDate(startDate) : undefined}
                minimalDate={startDate ? parseCalendarDate(startDate) : undefined}
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
        {(field) => (
          <field.TextField
            aria-label={`Nazwa wystawianego sprzętu, wiersz ${row.index + 1}`}
            placeholder="Nazwa sprzętu"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    header: ActionsHeader,
    cell: DeleteRowCell,
    size: 10,
  },
];

const longResearchEquipmentColumns = (
  form: FormBFormApi,
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
            aria-label={`Czynność, wiersz ${row.index + 1}`}
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
        {(field) => (
          <field.TextField aria-label={`Czas, wiersz ${row.index + 1}`} placeholder="Czas" disabled={isReadonly} />
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
      <form.AppField name={`longResearchEquipments[${row.index}].name`}>
        {(field) => (
          <field.TextField
            aria-label={`Nazwa pozostawianego lub zabieranego sprzętu, wiersz ${row.index + 1}`}
            placeholder="Nazwa sprzętu"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    header: ActionsHeader,
    cell: DeleteRowCell,
    size: 10,
  },
];

const portColumns = (form: FormBFormApi, isReadonly: boolean, allowPastDates: boolean): ColumnDef<PortCallValues>[] => [
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
            aria-label="Wejście"
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
                aria-label="Wyjście"
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
        {(field) => (
          <field.TextField
            aria-label={`Nazwa portu, wiersz ${row.index + 1}`}
            placeholder="Nazwa portu"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
    ),
  },
  {
    id: 'actions',
    header: ActionsHeader,
    cell: DeleteRowCell,
    size: 10,
  },
];

export function CruiseDetailsSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { isReadonly } = context;

  const [includeShortResearchEquipments, setIncludeShortResearchEquipments] = useState(false);
  const [includePorts, setIncludePorts] = useState(false);
  const shortEquipmentColumns = shortResearchEquipmentColumns(form, isReadonly, includeShortResearchEquipments);
  const longEquipmentColumns = longResearchEquipmentColumns(form, isReadonly);
  const portCallColumns = portColumns(form, isReadonly, includePorts);

  return (
    <Accordion title="12. Szczegóły rejsu" expandedByDefault>
      <p className="text-center text-xl font-semibold">Czy w ramach rejsu planuje się:</p>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wystawienie sprzętu</p>

        <form.AppField name="shortResearchEquipments" mode="array">
          {(field) => (
            <Table
              columns={shortEquipmentColumns}
              meta={{
                removeRow: (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
              }}
              data={field.state.value}
              buttons={() => [
                <Button
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
                </Button>,
              ]}
              disabled={isReadonly}
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.shortResearchEquipments}>
          {(shortEquipments) => (
            <>
              {!isReadonly && shortEquipments.length > 0 && (
                <Checkbox
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
            <Table
              columns={longEquipmentColumns}
              meta={{
                removeRow: (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
              }}
              data={field.state.value}
              buttons={() => [
                <AddMenuButton
                  key="new"
                  options={[
                    { value: 'Put', label: 'Pozostawienie' },
                    { value: 'Collect', label: 'Zabranie' },
                  ].map((option) => ({
                    label: option.label,
                    onSelect: () => {
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
                </AddMenuButton>,
              ]}
              disabled={isReadonly}
            />
          )}
        </form.AppField>
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold">Wchodzenie lub wychodzenie z portu</p>

        <form.AppField name="ports" mode="array">
          {(field) => (
            <Table
              columns={portCallColumns}
              meta={{
                removeRow: (index) => {
                  field.removeValue(index);
                  field.handleBlur();
                },
              }}
              data={field.state.value}
              buttons={() => [
                <Button
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
                </Button>,
              ]}
              disabled={isReadonly}
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.ports}>
          {(ports) => (
            <>
              {!isReadonly && ports.length > 0 && (
                <Checkbox
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
    </Accordion>
  );
}
