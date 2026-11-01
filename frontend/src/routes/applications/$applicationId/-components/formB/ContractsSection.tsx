import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { FileInput } from '@/components/shared/inputs/FileInput';
import { Input } from '@/components/shared/inputs/Input';
import { Table } from '@/components/shared/table/Table';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import {
  ContractValues,
  getContractCategoryName,
} from '@/routes/applications/$applicationId/-schemas/types/ContractValues';

export function ContractsSection({ context }: { context: FormBViewModel }) {
  const { formA, isReadonly } = context;

  const columns: ColumnDef<ContractValues>[] = [
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
          <Input
            name={`contracts[${row.index}].institutionName`}
            value={row.original.institutionName}
            label="Nazwa instytucji"
            disabled
          />
          <Input
            name={`contracts[${row.index}].institutionUnit`}
            value={row.original.institutionUnit}
            label="Jednostka"
            disabled
          />
          <Input
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
        <Input name={`contracts[${row.index}].description`} value={row.original.description} label="Opis" disabled />
      ),
      size: 20,
    },
    {
      header: 'Skany',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <FileInput
          name="scans"
          value={row.original.scans}
          allowMultiple={true}
          label="Skany"
          maxSizeInMb={2}
          showRequiredAsterisk
          disabled
        />
      ),
      size: 15,
    },
  ];

  return (
    <Accordion
      title="8. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <Table
        data={formA.contracts}
        buttons={() => []}
        columns={columns}
        emptyTableMessage="Nie dodano żadnej umowy."
        variant="form"
        disabled={isReadonly}
      />
    </Accordion>
  );
}
