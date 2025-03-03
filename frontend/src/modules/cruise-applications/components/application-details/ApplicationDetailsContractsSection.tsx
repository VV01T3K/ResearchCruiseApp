import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppTable } from '@/core/components/table/AppTable';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { getContractCategoryName } from '@/cruise-applications/models/ContractDto';
import { EvaluationFormAContract } from '@/cruise-applications/models/EvaluationDto';

export function ApplicationDetailsContractsSection() {
  const { evaluation } = useApplicationDetails();

  const columns: ColumnDef<EvaluationFormAContract>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 10,
    },
    {
      header: 'Kategoria',
      cell: ({ row }) => getContractCategoryName(row.original.contract.category) ?? 'Nieznany typ',
      size: 40,
    },
    {
      header: 'Instytucja',
      cell: ({ row }) => (
        <>
          <AppInput
            name={`contracts[${row.index}].institutionName`}
            value={row.original.contract.institutionName}
            label="Nazwa instytucji"
            disabled
          />
          <AppInput
            name={`contracts[${row.index}].institutionUnit`}
            value={row.original.contract.institutionUnit}
            label="Jednostka"
            disabled
          />
          <AppInput
            name={`contracts[${row.index}].institutionLocalization`}
            value={row.original.contract.institutionLocalization}
            label="Lokalizacja instytucji"
            disabled
          />
        </>
      ),
      size: 80,
    },
    {
      header: 'Opis',
      cell: ({ row }) => (
        <AppInput
          name={`contracts[${row.index}].description`}
          value={row.original.contract.description}
          label="Opis"
          disabled
        />
      ),
      size: 80,
    },
    {
      header: 'Skan',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppFileInput
          name="scan"
          value={row.original.contract.scan}
          acceptedMimeTypes={['application/pdf']}
          label="Skan"
          disabled
        />
      ),
      size: 80,
    },
    {
      header: 'Punkty',
      cell: ({ row }) => row.original.points,
      size: 10,
    },
  ];

  return (
    <AppAccordion
      title="4. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <div>
        <AppTable data={evaluation.formAContracts} columns={columns} emptyTableMessage="Nie dodano żadnej umowy." />
      </div>
    </AppAccordion>
  );
}
