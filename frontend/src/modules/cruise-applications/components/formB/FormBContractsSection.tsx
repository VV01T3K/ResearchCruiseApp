import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppTable } from '@/core/components/table/AppTable';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { ContractDto, getContractCategoryName } from '@/cruise-applications/models/ContractDto';

export function FormBContractsSection() {
  const { formA, isReadonly } = useFormB();

  const columns: ColumnDef<ContractDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Kategoria',
      cell: ({ row }) => getContractCategoryName(row.original.category) ?? 'Nieznany typ',
      size: 10,
    },
    {
      header: 'Instytucja',
      cell: ({ row }) => (
        <>
          <AppInput
            name={`contracts[${row.index}].institutionName`}
            value={row.original.institutionName}
            label="Nazwa instytucji"
            disabled
          />
          <AppInput
            name={`contracts[${row.index}].institutionUnit`}
            value={row.original.institutionUnit}
            label="Jednostka"
            disabled
          />
          <AppInput
            name={`contracts[${row.index}].institutionLocalization`}
            value={row.original.institutionLocalization}
            label="Lokalizacja instytucji"
            disabled
          />
        </>
      ),
      size: 20,
    },
    {
      header: 'Opis',
      cell: ({ row }) => (
        <AppInput name={`contracts[${row.index}].description`} value={row.original.description} label="Opis" disabled />
      ),
      size: 20,
    },
    {
      header: 'Skan',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppFileInput
          name="scan"
          value={row.original.scan}
          acceptedMimeTypes={['application/pdf']}
          label="Skan"
          disabled
        />
      ),
      size: 15,
    },
  ];

  return (
    <AppAccordion
      title="8. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <AppTable
        data={formA.contracts}
        buttons={() => []}
        columns={columns}
        emptyTableMessage="Nie dodano żadnej umowy."
        variant="form"
        disabled={isReadonly}
      />
    </AppAccordion>
  );
}
