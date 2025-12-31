import { AnyFieldApi } from '@tanstack/form-core';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { ContractDto, getContractCategoryName } from '@/cruise-applications/models/ContractDto';

export function FormCContractsSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  function getColumns(field: AnyFieldApi): ColumnDef<ContractDto>[] {
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
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
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
                field.removeValue(row.index);
                field.handleChange((prev: ContractDto[]) => prev);
                field.handleBlur();
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
      title="8. Umowy regulujące współpracę, w ramach której zostały zrealizowane zadania badawcze"
      expandedByDefault
      data-testid="form-c-contracts-section"
    >
      <div>
        <form.Field
          name="contracts"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <CruiseApplicationDropdownElementSelectorButton
                    key="new"
                    options={[
                      { name: 'Krajowa', category: 'domestic' },
                      { name: 'Międzynarodowa', category: 'international' },
                    ].map(({ name, category }) => ({
                      value: name,
                      onClick: () => {
                        field.pushValue({
                          category: category as ContractDto['category'],
                          institutionName: '',
                          institutionUnit: '',
                          institutionLocalization: '',
                          description: '',
                          scans: [],
                        });
                        field.handleChange((prev: ContractDto[]) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nowy kontrakt
                  </CruiseApplicationDropdownElementSelectorButton>,
                  <CruiseApplicationDropdownElementSelectorButton
                    key="historical"
                    options={formAInitValues.historicalContracts.map((contract) => ({
                      value: `${contract.institutionName}, ${contract.institutionUnit}, ${contract.institutionLocalization} - ${contract.description}`,
                      onClick: () => {
                        field.pushValue(contract);
                        field.handleChange((prev: ContractDto[]) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczną umowę
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnej umowy."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}
