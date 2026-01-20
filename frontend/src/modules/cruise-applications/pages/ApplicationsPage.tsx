import { ColumnDef } from '@tanstack/react-table';
import ZoomInIcon from 'bootstrap-icons/icons/zoom-in.svg?react';
import dayjs from 'dayjs';

import { AppAvatar } from '@/core/components/AppAvatar';
import { AppBadge } from '@/core/components/AppBadge';
import { AppButton } from '@/core/components/AppButton';
import { AppGuard } from '@/core/components/AppGuard';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppTable } from '@/core/components/table/AppTable';
import { getDisplayPeriod } from '@/cruise-applications/helpers/periodUtils';
import { useCruiseApplicationsQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { CruiseApplicationDto, CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

const dateFormat = 'DD.MM.YYYY';

export function ApplicationsPage() {
  const applicationsQuery = useCruiseApplicationsQuery();

  const columns: ColumnDef<CruiseApplicationDto>[] = [
    {
      id: 'number',
      header: 'Nr',
      accessorFn: (row) => row.number,
      sortDescFirst: true,
      size: 2,
    },
    {
      header: 'Data',
      accessorFn: (row) => row.date,
      size: 5,
    },
    {
      header: 'Rok rejsu',
      accessorFn: (row) => row.year.toString(),
      size: 5,
    },
    {
      header: 'Liczba dni',
      accessorFn: (row) => (row.cruiseDays !== null ? `${parseFloat(row.cruiseDays.toFixed(2))}` : '-'),
      size: 5,
    },
    {
      header: 'Okres optymalny / dopuszczalny',
      cell: ({ row }) => {
        const { start, end } = getDisplayPeriod(row.original);
        if (start && end) {
          return (
            <div className="text-sm">
              <div>od: {dayjs(start).format(dateFormat)}</div>
              <div>do: {dayjs(end).format(dateFormat)}</div>
            </div>
          );
        }
        return '-';
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 15,
    },
    {
      header: 'Data rejsu',
      cell: ({ row }) => {
        if (row.original.startDate && row.original.endDate) {
          return (
            <div className="text-sm">
              <div>od: {dayjs(row.original.startDate).format(dateFormat)}</div>
              <div>do: {dayjs(row.original.endDate).format(dateFormat)}</div>
            </div>
          );
        }
        return '-';
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 20,
    },
    {
      header: 'Kierownik',
      accessorFn: (row) => `${row.cruiseManagerFirstName} ${row.cruiseManagerLastName}`,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar
            fullName={`${row.original.cruiseManagerFirstName} ${row.original.cruiseManagerLastName}`}
            variant="small"
          />
          <span>{`${row.original.cruiseManagerFirstName} ${row.original.cruiseManagerLastName}`}</span>
        </div>
      ),
      size: 20,
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
      size: 15,
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
          <p className="mb-2 text-right italic sm:text-center">
            {row.original.status}
            {row.original.status === CruiseApplicationStatus.Draft ? ` (${row.original.note})` : null}
          </p>
          {row.original.status === CruiseApplicationStatus.Draft && (
            <AppButton
              className="ml-auto sm:mx-auto"
              size="sm"
              type="link"
              href={`/applications/${row.original.id}/formA?mode=edit`}
            >
              Kontynuuj wypełnianie
            </AppButton>
          )}
          {row.original.status === CruiseApplicationStatus.FormBRequired && (
            <AppGuard allowedUserIds={[row.original.cruiseManagerId, row.original.deputyManagerId]}>
              <AppButton
                className="ml-auto sm:mx-auto"
                size="sm"
                type="link"
                href={`/applications/${row.original.id}/formB?mode=edit`}
              >
                Wypełnij
              </AppButton>
            </AppGuard>
          )}
          {row.original.status === CruiseApplicationStatus.Undertaken && (
            <div className="flex flex-col items-center gap-2">
              <AppGuard allowedUserIds={[row.original.cruiseManagerId, row.original.deputyManagerId]}>
                <AppButton
                  className="ml-auto sm:mx-auto"
                  size="sm"
                  type="link"
                  href={`/applications/${row.original.id}/formC?mode=edit`}
                >
                  Wypełnij formularz C
                </AppButton>
              </AppGuard>
              <div>
                <AppBadge variant="success">{row.original.effectsDoneRate} efektów</AppBadge>
              </div>
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
            <ZoomInIcon className="h-4 w-4" />
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
      <AppLayout title="Zgłoszenia" variant="wide">
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
