import { ColumnDef } from '@tanstack/react-table';
import ZoomInIcon from 'bootstrap-icons/icons/zoom-in.svg?react';

import { AppAvatar } from '@/core/components/AppAvatar';
import { AppBadge } from '@/core/components/AppBadge';
import { AppButton } from '@/core/components/AppButton';
import { AppGuard } from '@/core/components/AppGuard';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppTable } from '@/core/components/table/AppTable';
import { useCruiseApplicationsQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { CruiseApplicationDto, CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

export function ApplicationsPage() {
  const applicationsQuery = useCruiseApplicationsQuery();

  const columns: ColumnDef<CruiseApplicationDto>[] = [
    {
      id: 'number',
      header: 'Numer',
      accessorFn: (row) => row.number,
      sortDescFirst: true,
      size: 5,
    },
    {
      header: 'Data',
      accessorFn: (row) => row.date,
      size: 10,
    },
    {
      header: 'Rok rejsu',
      accessorFn: (row) => row.year,
      size: 10,
    },
    {
      id: 'avatar',
      header: undefined,
      accessorFn: (row) => `${row.cruiseManagerFirstName} ${row.cruiseManagerLastName}`,
      cell: (cell) => <AppAvatar fullName={cell.getValue() as string} variant="small" />,
      enableColumnFilter: false,
      enableSorting: false,
      size: 5,
    },
    {
      header: 'Kierownik',
      accessorFn: (row) => `${row.cruiseManagerFirstName} ${row.cruiseManagerLastName}`,
      size: 15,
    },
    {
      header: 'Formularze',
      cell: ({ row }) => {
        const isFormBReadOnly =
          row.original.status !== CruiseApplicationStatus.FormBFilled &&
          row.original.status !== CruiseApplicationStatus.Undertaken;
        return (
          <div className="flex flex-col gap-1">
            <AppLink disabled={!row.original.hasFormA} href={`/applications/${row.original.id}/formA`}>
              Formularz A
            </AppLink>
            <AppLink
              disabled={!row.original.hasFormB}
              href={`/applications/${row.original.id}/formB?mode=${isFormBReadOnly ? 'view' : 'preview'}`}
            >
              Formularz B
            </AppLink>
            <AppLink disabled={!row.original.hasFormC} href={`/applications/${row.original.id}/formC`}>
              Formularz C
            </AppLink>
          </div>
        );
      },
      size: 10,
    },
    {
      header: 'Punkty',
      accessorFn: (row) => `${row.points} pkt.`,
      cell: ({ row }) => <AppBadge>{row.original.points} pkt.</AppBadge>,
      size: 5,
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      cell: ({ row }) => (
        <>
          <p className="italic">{row.original.status}</p>
          {row.original.status === CruiseApplicationStatus.Draft && (
            <div className="flex flex-col">
              <p className="text-sm">{row.original.note}</p>
              <AppButton
                className="inline-block mx-auto px-4 py-0.5 mt-1"
                size="plain"
                type="link"
                href={`/applications/${row.original.id}/formA?mode=edit`}
              >
                Kontynuuj wypełnianie
              </AppButton>
            </div>
          )}
          {row.original.status === CruiseApplicationStatus.FormBRequired && (
            <AppGuard allowedUserIds={[row.original.cruiseManagerId, row.original.deputyManagerId]}>
              <AppButton
                className="inline-block mx-auto px-5 py-1"
                size="plain"
                type="link"
                href={`/applications/${row.original.id}/formB?mode=edit`}
              >
                Wypełnij
              </AppButton>
            </AppGuard>
          )}
          {row.original.status === CruiseApplicationStatus.Undertaken && (
            <div className="flex flex-col gap-2 items-center">
              <AppGuard allowedUserIds={[row.original.cruiseManagerId, row.original.deputyManagerId]}>
                <AppButton
                  className="inline-block mx-auto px-4 py-0.5 mt-1"
                  size="plain"
                  type="link"
                  href={`/applications/${row.original.id}/formC?mode=edit`}
                >
                  Wypełnij formularz C
                </AppButton>
              </AppGuard>
              <AppBadge variant="success">{row.original.effectsDoneRate} efektów</AppBadge>
            </div>
          )}
        </>
      ),
      size: 20,
    },
    {
      header: 'Akcje',
      cell: ({ row }) => (
        <>
          <AppButton type="link" href={`/applications/${row.original.id}/details`} className="flex gap-2">
            Szczegóły
            <ZoomInIcon className="w-4 h-4" />
          </AppButton>
        </>
      ),
      size: 5,
    },
  ];

  const initialSortingState = [
    {
      id: 'number',
      desc: true,
    },
  ];

  return (
    <>
      <AppLayout title="Zgłoszenia">
        <AppTable
          data={applicationsQuery.data}
          columns={columns}
          buttons={(defaultButtons) => [...defaultButtons]}
          initialSortingState={initialSortingState}
        />
      </AppLayout>
    </>
  );
}
