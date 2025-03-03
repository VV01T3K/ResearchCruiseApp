import { ColumnDef } from '@tanstack/react-table';
import { AppLink } from '@/core/components/AppLink';

import { Suspense } from 'react';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { AppTable } from '@/core/components/table/AppTable';

import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { useCruiseApplicationsQuery } from "@/cruise-applications/hooks/CruiseApplicationsApiHooks";

export function ApplicationsPage() {
  const applicationsQuery = useCruiseApplicationsQuery();

  const columns: ColumnDef<CruiseApplicationDto>[] = [
    {
      header: 'Numer/data',
      accessorFn: (row) => `${row.number}/${row.date}`,
    },
    {
      header: 'Rok rejsu',
      accessorFn: (row) => `${row.year}`,
    },
    {
      header: 'Kierownik',
      accessorFn: (row) => `${row.cruiseManagerFirstName} ${row.cruiseManagerLastName}`,
    },
    {
      header: 'Formularze',
      cell: ( {row} ) => (
        <div className='flex flex-col gap-1'>
          <AppLink disabled={!row.original.hasFormA} href={`/cruises/${row.original.id}/formA`}>Formularz A</AppLink>
          <AppLink disabled={!row.original.hasFormB} href={`/cruises/${row.original.id}/formB`}>Formularz B</AppLink>
          <AppLink disabled={!row.original.hasFormC} href={`/cruises/${row.original.id}/formC`}>Formularz C</AppLink>
        </div>
      )
    },
    {
      header: 'Punkty',
      accessorFn: (row) => `${row.points}`,
    },
    {
      header: 'Status',
      accessorFn: (row) => `${row.status}`,
    },
    {
      header: 'Akcje',
      cell: ( {row} ) => (
        <>
          <AppLink href={`/applications/${row.original.id}/details`}>Szczegóły</AppLink>
        </>
      )
    }
  ];

  return (
    <>
      <AppLayout title="Zgłoszenia">
        <Suspense fallback={<AppLoader />}>
          <AppTable
            data={applicationsQuery.data}
            columns={columns}
            buttons={(defaultButtons) => [
              ...defaultButtons,
            ]}
          />
        </Suspense>
      </AppLayout>
    </>
  );
};
