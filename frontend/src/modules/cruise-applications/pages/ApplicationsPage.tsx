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
import { useCruiseApplicationsQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { CruiseApplicationDto, CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

function convertPeriodNumberToDate(periodNumber: string, year: number): Date {
  const num = parseInt(periodNumber);
  const startDay = num % 2 === 0 ? 1 : 15;
  const startMonth = Math.floor(num / 2) + 1;
  return new Date(year, startMonth - 1, startDay, 8, 0, 0);
}

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
      accessorFn: (row) => row.year,
      size: 5,
    },
    {
      header: 'Liczba dni rejsowych',
      cell: ({ row }) => {
        const cruiseHours = row.original.cruiseHours;
        if (!cruiseHours) return '-';
        const days = Math.floor(parseInt(cruiseHours) / 24);
        return days > 0 ? `${days}` : '-';
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 10,
    },
    {
      header: 'Okres optymalny / dopuszczalny',
      cell: ({ row }) => {
        let start, end;
        if (row.original.precisePeriodStart && row.original.precisePeriodEnd) {
          start = row.original.precisePeriodStart;
          end = row.original.precisePeriodEnd;
        }
        if (row.original.optimalPeriodBeg && row.original.optimalPeriodEnd) {
          start = convertPeriodNumberToDate(row.original.optimalPeriodBeg, row.original.year);
          end = convertPeriodNumberToDate(row.original.optimalPeriodEnd, row.original.year);
        }
        if (row.original.acceptablePeriodBeg && row.original.acceptablePeriodEnd) {
          start = convertPeriodNumberToDate(row.original.acceptablePeriodBeg, row.original.year);
          end = convertPeriodNumberToDate(row.original.acceptablePeriodEnd, row.original.year);
        }
        if (start && end) {
          return (
            <div className="text-sm">
              <div>od: {dayjs(start).format('YYYY-MM-DD')}</div>
              <div>do: {dayjs(end).format('YYYY-MM-DD')}</div>
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
        if (row.original.precisePeriodStart && row.original.precisePeriodEnd) {
          return (
            <div className="text-sm">
              <div>{dayjs(row.original.precisePeriodStart).format('YYYY-MM-DD')}</div>
              <div>{dayjs(row.original.precisePeriodEnd).format('YYYY-MM-DD')}</div>
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
          <p className="italic text-right sm:text-center mb-2">
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
            <div className="flex flex-col gap-2 items-center">
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
