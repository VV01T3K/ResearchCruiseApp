import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { withForm } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { ResearchAreaValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { getResearchAreaName } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaOption';

import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';

export const ResearchAreaSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function ResearchAreaSection({ form, context }) {
    const { isReadonly, formAInitValues } = context;

    function getColumns(removeRow: (index: number) => void): ColumnDef<ResearchAreaValues>[] {
      return [
        {
          header: 'Lp.',
          cell: ({ row }) => `${row.index + 1}. `,
          size: 5,
        },
        {
          header: 'Rejon prowadzenia badań',
          cell: ({ row }) => (
            <>
              <form.AppField
                name={`researchAreaDescriptions[${row.index}].areaId`}
                children={(field) => <input type="hidden" name={field.name} value="" readOnly />}
              />
              <form.AppField
                listeners={{
                  onChange: () => {
                    form.setFieldValue(`researchAreaDescriptions[${row.index}].areaId`, null);
                  },
                }}
                name={`researchAreaDescriptions[${row.index}].differentName`}
                children={(field) => (
                  <field.TextField
                    value={
                      field.state.value ??
                      getResearchAreaName(formAInitValues.researchAreas, row.original.areaId ?? '') ??
                      ''
                    }
                    placeholder="Nazwa rejonu"
                    disabled={isReadonly}
                  />
                )}
              />
            </>
          ),
          size: 30,
        },
        {
          header: 'Informacje dodatkowe',
          cell: ({ row }) => (
            <form.AppField
              name={`researchAreaDescriptions[${row.index}].info`}
              children={(field) => (
                <field.TextField
                  placeholder={isReadonly ? '' : 'np. szczegóły dotyczące celu rejsu'}
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
          size: 5,
        },
      ];
    }

    return (
      <AppAccordion title="5. Rejony prowadzenia badań" expandedByDefault data-testid="form-c-research-area-section">
        <form.AppField
          name="researchAreaDescriptions"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns((index) => {
                  field.removeValue(index);
                  field.handleChange((prev) => prev);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <DropdownElementSelectorButton
                    key="new"
                    options={formAInitValues.researchAreas.concat([{ id: '', name: 'Inne...' }]).map((area) => ({
                      value: area.name,
                      onClick: () => {
                        field.pushValue({
                          areaId: area.id != '' ? area.id : null,
                          differentName: area.id != '' ? null : '',
                          info: '',
                        });
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj rejon
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego rejonu."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta)}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} />
            </>
          )}
        />
      </AppAccordion>
    );
  },
});
