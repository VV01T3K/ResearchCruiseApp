import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { UploadedFileList } from '@/components/shared/inputs/parts/UploadedFileList';
import { Input } from '@/components/shared/inputs/Input';
import { Table } from '@/components/shared/table/Table';
import {
  type ApplicationEvaluation,
  useApplicationEvaluation,
} from '@/features/applications/hooks/useApplicationDetails';
import { getContractCategoryName } from '@/features/applications/schemas/types/ContractValues';

export function ContractsSection() {
  const evaluation = useApplicationEvaluation();

  const columns: ColumnDef<ApplicationEvaluation['formAContracts'][number]>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Kategoria',
      cell: ({ row }) => getContractCategoryName(row.original.contract.category),
      size: 10,
    },
    {
      header: 'Instytucja',
      cell: ({ row }) => (
        <>
          <Input
            name={`contracts[${row.index}].institutionName`}
            value={row.original.contract.institutionName}
            label="Nazwa instytucji"
            disabled
          />
          <Input
            name={`contracts[${row.index}].institutionUnit`}
            value={row.original.contract.institutionUnit}
            label="Jednostka"
            disabled
          />
          <Input
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
        <Input
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
      cell: ({ row }) => <UploadedFileList files={row.original.contract.scans} disabled />,
      size: 20,
    },
    {
      header: 'Punkty',
      cell: ({ row }) => row.original.points,
      size: 5,
    },
  ];

  return (
    <Accordion
      title="4. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <div className="pb-2">
        <Table
          data={evaluation.formAContracts}
          columns={columns}
          emptyTableMessage="Nie dodano żadnej umowy."
          disabled
        />
      </div>
    </Accordion>
  );
}
