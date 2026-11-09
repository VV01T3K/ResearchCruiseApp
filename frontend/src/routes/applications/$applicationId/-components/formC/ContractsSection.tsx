import { mapContractToValues } from '@/features/applications/schemas/formA.schema';
import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { DropdownElementSelectorButton } from '@/features/applications/components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { ContractValues, getContractCategoryName } from '@/features/applications/schemas/types/ContractValues';

export function ContractsSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly, formAInitValues } = context;

  function getColumns(removeRow: (index: number) => void): ColumnDef<ContractValues>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
      },
      {
        header: 'Kategoria',
        accessorFn: (row) => getContractCategoryName(row.category),
        cell: ({ row }) => (
          <form.AppField name={`contracts[${row.index}].category`}>
            {(field) => getContractCategoryName(field.state.value)}
          </form.AppField>
        ),
        size: 10,
      },
      {
        header: 'Instytucja',
        accessorFn: (row) => `${row.institutionName}, ${row.institutionUnit}, ${row.institutionLocalization}`,
        cell: ({ row }) => (
          <>
            <form.AppField name={`contracts[${row.index}].institutionName`}>
              {(field) => (
                <field.TextField
                  aria-label={`Nazwa instytucji, wiersz ${row.index + 1}`}
                  label="Nazwa instytucji"
                  placeholder='np. "Uniwersytet Gdański"'
                  disabled={isReadonly}
                />
              )}
            </form.AppField>
            <form.AppField name={`contracts[${row.index}].institutionUnit`}>
              {(field) => (
                <field.TextField
                  aria-label={`Jednostka, wiersz ${row.index + 1}`}
                  label="Jednostka"
                  placeholder='np. "Wydział Biologii"'
                  disabled={isReadonly}
                />
              )}
            </form.AppField>
            <form.AppField name={`contracts[${row.index}].institutionLocalization`}>
              {(field) => (
                <field.TextField
                  aria-label={`Lokalizacja instytucji, wiersz ${row.index + 1}`}
                  label="Lokalizacja instytucji"
                  placeholder='np. "Gdańsk"'
                  disabled={isReadonly}
                />
              )}
            </form.AppField>
          </>
        ),
        size: 30,
      },
      {
        header: 'Opis',
        accessorFn: (row) => row.description,
        cell: ({ row }) => (
          <form.AppField name={`contracts[${row.index}].description`}>
            {(field) => (
              <field.TextField
                aria-label={`Opis, wiersz ${row.index + 1}`}
                label="Opis"
                placeholder='np. "Umowa o współpracy"'
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 30,
      },
      {
        header: 'Skany',
        accessorFn: (row) => row.scans,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField name={`contracts[${row.index}].scans`}>
            {(field) => (
              <field.FileField
                allowMultiple={true}
                label="Skany"
                uploadMessage="Kliknij lub przeciągnij pliki"
                maxSizeInMb={2}
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
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
    <Accordion
      title="8. Umowy regulujące współpracę, w ramach której zostały zrealizowane zadania badawcze"
      expandedByDefault
    >
      <div>
        <form.AppField name="contracts" mode="array">
          {(field) => (
            <>
              <Table
                columns={getColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <DropdownElementSelectorButton
                    key="new"
                    options={[
                      { name: 'Krajowa', category: 'domestic' },
                      { name: 'Międzynarodowa', category: 'international' },
                    ].map(({ name, category }) => ({
                      value: name,
                      onClick: () => {
                        field.pushValue({
                          category: category as ContractValues['category'],
                          institutionName: '',
                          institutionUnit: '',
                          institutionLocalization: '',
                          description: '',
                          scans: [],
                        });
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nowy kontrakt
                  </DropdownElementSelectorButton>,
                  <DropdownElementSelectorButton
                    key="historical"
                    options={formAInitValues.historicalContracts.map((contract) => ({
                      value: `${contract.institutionName}, ${contract.institutionUnit}, ${contract.institutionLocalization} - ${contract.description}`,
                      onClick: () => {
                        field.pushValue(mapContractToValues(contract));
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczną umowę
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnej umowy."
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </>
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
