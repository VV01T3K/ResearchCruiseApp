import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import {
  ContractValues,
  getContractCategoryName,
} from '@/routes/applications/$applicationId/-schemas/types/ContractValues';

export function ContractsSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

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
          <form.AppField
            name={`contracts[${row.index}].category`}
            children={(field) => getContractCategoryName(field.state.value)}
          />
        ),
        size: 10,
      },
      {
        header: 'Instytucja',
        accessorFn: (row) => `${row.institutionName}, ${row.institutionUnit}, ${row.institutionLocalization}`,
        cell: ({ row }) => (
          <>
            <form.AppField
              name={`contracts[${row.index}].institutionName`}
              children={(field) => (
                <field.TextField
                  label="Nazwa instytucji"
                  placeholder='np. "Uniwersytet Gdański"'
                  disabled={isReadonly}
                />
              )}
            />
            <form.AppField
              name={`contracts[${row.index}].institutionUnit`}
              children={(field) => (
                <field.TextField label="Jednostka" placeholder='np. "Wydział Biologii"' disabled={isReadonly} />
              )}
            />
            <form.AppField
              name={`contracts[${row.index}].institutionLocalization`}
              children={(field) => (
                <field.TextField label="Lokalizacja instytucji" placeholder='np. "Gdańsk"' disabled={isReadonly} />
              )}
            />
          </>
        ),
        size: 30,
      },
      {
        header: 'Opis',
        accessorFn: (row) => row.description,
        cell: ({ row }) => (
          <form.AppField
            name={`contracts[${row.index}].description`}
            children={(field) => (
              <field.TextField label="Opis" placeholder='np. "Umowa o współpracy"' disabled={isReadonly} />
            )}
          />
        ),
        size: 30,
      },
      {
        header: 'Skany',
        accessorFn: (row) => row.scans,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.AppField
            name={`contracts[${row.index}].scans`}
            children={(field) => (
              <field.FilesField
                allowMultiple={true}
                label="Skany"
                uploadMessage="Kliknij lub przeciągnij pliki"
                maxSizeInMb={2}
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
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
    <AppAccordion
      title="7. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
      data-testid="form-a-contracts-section"
    >
      <div>
        <form.AppField
          name="contracts"
          mode="array"
          children={(field) => (
            <>
              <AppTable
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
                    data-testid="form-a-add-contract-btn"
                  >
                    Dodaj nowy kontrakt
                  </DropdownElementSelectorButton>,
                  <DropdownElementSelectorButton
                    key="historical"
                    options={initValues.historicalContracts.map((contract) => ({
                      value: `${contract.institutionName}, ${contract.institutionUnit}, ${contract.institutionLocalization} - ${contract.description}`,
                      onClick: () => {
                        field.pushValue(contract);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                    data-testid="form-a-add-historical-contract-btn"
                  >
                    Dodaj historyczną umowę
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnej umowy."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                data-testid="form-a-contracts-table"
              />
              <AppInputErrorsList
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                data-testid="form-a-contracts-errors"
              />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
