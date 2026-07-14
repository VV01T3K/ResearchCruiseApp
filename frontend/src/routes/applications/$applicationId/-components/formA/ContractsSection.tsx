import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { withForm } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import {
  ContractValues,
  getContractCategoryName,
} from '@/routes/applications/$applicationId/-schemas/types/ContractValues';

export const ContractsSection = withForm({
  defaultValues: formADefaultValues,
  props: {} as { context: FormAViewModel },
  render: function ContractsSection({ form, context }) {
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
            <form.Field
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
              <form.Field
                name={`contracts[${row.index}].institutionName`}
                children={(field) => (
                  <AppInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta)}
                    label="Nazwa instytucji"
                    placeholder='np. "Uniwersytet Gdański"'
                    disabled={isReadonly}
                  />
                )}
              />
              <form.Field
                name={`contracts[${row.index}].institutionUnit`}
                children={(field) => (
                  <AppInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta)}
                    label="Jednostka"
                    placeholder='np. "Wydział Biologii"'
                    disabled={isReadonly}
                  />
                )}
              />
              <form.Field
                name={`contracts[${row.index}].institutionLocalization`}
                children={(field) => (
                  <AppInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta)}
                    label="Lokalizacja instytucji"
                    placeholder='np. "Gdańsk"'
                    disabled={isReadonly}
                  />
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
            <form.Field
              name={`contracts[${row.index}].description`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
                  label="Opis"
                  placeholder='np. "Umowa o współpracy"'
                  disabled={isReadonly}
                />
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
            <form.Field
              name={`contracts[${row.index}].scans`}
              children={(field) => (
                <AppFileInput
                  name={field.name}
                  value={field.state.value}
                  allowMultiple={true}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
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
          <form.Field
            name="contracts"
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
                          field.handleChange((prev: ContractValues[]) => prev);
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
                          field.handleChange((prev: ContractValues[]) => prev);
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
                  errors={getErrors(field.state.meta)}
                  data-testid="form-a-contracts-table"
                />
                <AppInputErrorsList errors={getErrors(field.state.meta)} data-testid="form-a-contracts-errors" />
              </>
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
