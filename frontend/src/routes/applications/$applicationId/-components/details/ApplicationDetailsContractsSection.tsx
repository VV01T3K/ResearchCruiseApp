import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppTable } from '@/components/shared/table/AppTable';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';
import { getContractCategoryName } from '@/api/dto/applications/ContractDto';
import { EvaluationFormAContract } from '@/api/dto/applications/EvaluationDto';

export function ApplicationDetailsContractsSection() {
  const { evaluation } = useApplicationDetails();

  const columns: ColumnDef<EvaluationFormAContract>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Kategoria',
      cell: ({ row }) => getContractCategoryName(row.original.contract.category) ?? 'Nieznany typ',
      size: 10,
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
      size: 30,
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
      size: 30,
    },
    {
      header: 'Skany',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <AppFileInput
          name="scans"
          value={row.original.contract.scans}
          allowMultiple={true}
          label="Skany"
          maxSizeInMb={2}
          disabled
        />
      ),
      size: 20,
    },
    {
      header: 'Punkty',
      cell: ({ row }) => row.original.points,
      size: 5,
    },
  ];

  return (
    <AppAccordion
      title="4. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <div className="pb-2">
        <AppTable
          data={evaluation.formAContracts}
          columns={columns}
          emptyTableMessage="Nie dodano żadnej umowy."
          disabled
        />
      </div>
    </AppAccordion>
  );
}
