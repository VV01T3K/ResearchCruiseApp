import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { ResearchAreaValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { getResearchAreaName } from '@/api/client/applications/types/ResearchAreaOption';

import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';

export function ResearchAreaSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

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
                    field.state.value ?? getResearchAreaName(initValues.researchAreas, row.original.areaId ?? '') ?? ''
                  }
                  placeholder="Nazwa rejonu"
                  disabled={isReadonly}
                  showRequiredAsterisk
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
    <AppAccordion title="4. Rejony prowadzenia badań" expandedByDefault data-testid="form-a-research-area-section">
      <form.AppField
        name="researchAreaDescriptions"
        mode="array"
        children={(field) => (
          <>
            <AppTable
              columns={getColumns((index) => {
                field.removeValue(index);
                field.handleBlur();
              })}
              data={field.state.value}
              showRequiredAsterisk
              buttons={() => [
                <DropdownElementSelectorButton
                  key="new"
                  options={initValues.researchAreas.concat([{ id: '', name: 'Inne...' }]).map((area) => ({
                    value: area.name,
                    onClick: () => {
                      field.pushValue({
                        areaId: area.id != '' ? area.id : null,
                        differentName: area.id != '' ? null : '',
                        info: '',
                      });
                      field.handleBlur();
                    },
                  }))}
                  variant="primary"
                  disabled={isReadonly}
                  data-testid="form-a-add-research-area-btn"
                >
                  Dodaj rejon
                </DropdownElementSelectorButton>,
              ]}
              emptyTableMessage="Nie dodano żadnego rejonu."
              variant="form"
              disabled={isReadonly}
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              data-testid="form-a-research-areas-table"
            />
            <AppInputErrorsList
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              data-testid="form-a-research-areas-errors"
            />
          </>
        )}
      />
    </AppAccordion>
  );
}
