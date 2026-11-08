import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/features/applications/models/formA-view-model';
import { formADefaultValues, MAX_RESEARCH_AREA_FILES } from '@/features/applications/schemas/formA.schema';
import { ResearchAreaValues } from '@/features/applications/schemas/types/ResearchAreaValues';
import { getResearchAreaName } from '@/lib/applications/researchArea';

import { DropdownElementSelectorButton } from '@/features/applications/components/form-controls/DropdownElementSelectorButton';

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
            <form.AppField name={`researchAreaDescriptions[${row.index}].areaId`}>
              {(field) => <input type="hidden" name={field.name} value="" readOnly />}
            </form.AppField>
            <form.AppField
              listeners={{
                onChange: () => {
                  form.setFieldValue(`researchAreaDescriptions[${row.index}].areaId`, null);
                },
              }}
              name={`researchAreaDescriptions[${row.index}].differentName`}
            >
              {(field) => (
                <field.TextField
                  aria-label={`Nazwa rejonu, wiersz ${row.index + 1}`}
                  value={
                    field.state.value ?? getResearchAreaName(initValues.researchAreas, row.original.areaId ?? '') ?? ''
                  }
                  placeholder="Nazwa rejonu"
                  disabled={isReadonly}
                  showRequiredAsterisk
                />
              )}
            </form.AppField>
          </>
        ),
        size: 30,
      },
      {
        header: 'Informacje dodatkowe',
        cell: ({ row }) => (
          <form.AppField name={`researchAreaDescriptions[${row.index}].info`}>
            {(field) => (
              <field.TextField
                aria-label={`Informacje dodatkowe, wiersz ${row.index + 1}`}
                placeholder={isReadonly ? '' : 'np. szczegóły dotyczące celu rejsu'}
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Akcje</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableDeleteRowButton
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
    <Accordion title="4. Rejony prowadzenia badań" expandedByDefault>
      <form.AppField name="researchAreaDescriptions" mode="array">
        {(field) => (
          <>
            <Table
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
                >
                  Dodaj rejon
                </DropdownElementSelectorButton>,
              ]}
              emptyTableMessage="Nie dodano żadnego rejonu."
              disabled={isReadonly}
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
            />
            <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
          </>
        )}
      </form.AppField>
      <div className="mt-4">
        <form.AppField name="researchAreaFiles">
          {(field) => (
            <field.FilesField
              allowMultiple
              label="Załączniki, np. mapy"
              helper={
                isReadonly ? undefined : `Tylko pliki PDF, maksymalnie ${MAX_RESEARCH_AREA_FILES} plików po 2 MB.`
              }
              uploadMessage="Kliknij lub przeciągnij pliki PDF"
              emptyMessage="Nie dodano załączników."
              maxSizeInMb={2}
              acceptedMimeTypes={['application/pdf']}
              disabled={isReadonly}
            />
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
