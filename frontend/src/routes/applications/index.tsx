import { useGetApplicationManagersSuspense } from '@/api/generated/endpoints/applications.gen';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { ColumnFiltersState, SortingState, functionalUpdate } from '@tanstack/react-table';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { MagnifyingGlassPlusIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Guard } from '@/components/shared/Guard';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { Table } from '@/components/shared/table/Table';
import { getDisplayPeriod } from '@/lib/applications/periodUtils';
import { formatDate, useNow } from '@/lib/dateUtils';
import {
  CruiseApplicationsFilter,
  CruiseApplicationsSort,
  useCruiseApplicationsInfiniteQuery,
} from '@/routes/applications/-hooks/useApplications';
import { ApplicationResponse, CruiseApplicationStatus } from '@/api/generated/schemas';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { getPersonName } from '@/lib/applications/person';
import { canRevertFormB, getApplicationStatusLabel } from '@/lib/applications/status';

export const Route = createFileRoute('/applications/')({
  component: ApplicationsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
});

const statusFilterOptions = CruiseApplicationStatus.options;

const EARLIEST_APPLICATION_YEAR = 2024;
const YEAR_FILTER_OPTIONS_AHEAD = 3;

function columnFiltersToApiFilter(columnFilters: ColumnFiltersState): CruiseApplicationsFilter {
  const getValues = (id: string) => columnFilters.find((filter) => filter.id === id)?.value as string[] | undefined;

  return {
    number: getValues('number')?.map(Number),
    date: getValues('date'),
    status: getValues('status'),
    year: getValues('year')?.map(Number),
    cruiseManager: getValues('cruiseManager'),
  };
}

const DEFAULT_SORTING_STATE: SortingState = [{ id: 'number', desc: true }];

function sortingStateToApiSort(sorting: SortingState): CruiseApplicationsSort {
  const [sort] = sorting;
  return sort ? { sortBy: sort.id, descending: sort.desc } : { sortBy: 'number', descending: true };
}

function ApplicationsPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const filter = useMemo(() => columnFiltersToApiFilter(columnFilters), [columnFilters]);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING_STATE);
  const sort = useMemo(() => sortingStateToApiSort(sorting), [sorting]);
  const applicationsQuery = useCruiseApplicationsInfiniteQuery(filter, sort);
  const applications = useMemo(
    () => applicationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [applicationsQuery.data]
  );
  const currentYear = useNow((now) => now.getFullYear());
  const yearFilterOptions = Array.from(
    { length: currentYear + YEAR_FILTER_OPTIONS_AHEAD - EARLIEST_APPLICATION_YEAR + 1 },
    (_, index) => (EARLIEST_APPLICATION_YEAR + index).toString()
  );
  const cruiseManagersQuery = useGetApplicationManagersSuspense();
  const cruiseManagerFilterOptions = cruiseManagersQuery.data.map((manager) => manager.id);
  const managerLabels = new Map(cruiseManagersQuery.data.map((manager) => [manager.id, mapPersonToText(manager)]));

  const columns: ColumnDef<ApplicationResponse>[] = [
    {
      id: 'number',
      header: 'Nr',
      accessorFn: (row) => row.number,
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.number}</span>,
      sortDescFirst: true,
      meta: { filterInputType: 'number' },
      size: 86,
    },
    {
      id: 'date',
      header: 'Data',
      accessorFn: (row) => row.date,
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.date}</span>,
      sortDescFirst: true,
      meta: { filterInputType: 'date' },
      size: 98,
    },
    {
      id: 'year',
      header: 'Rok rejsu',
      accessorFn: (row) => row.year?.toString() ?? '-',
      sortDescFirst: true,
      meta: { filterOptions: yearFilterOptions },
      size: 91,
    },
    {
      header: 'Liczba dni',
      accessorFn: (row) => (row.cruiseDays !== null ? `${parseFloat(row.cruiseDays.toFixed(2))}` : '-'),
      enableSorting: false,
      enableColumnFilter: false,
      size: 74,
    },
    {
      header: 'Okres optymalny / dopuszczalny',
      cell: ({ row }) => {
        const { start, end } = getDisplayPeriod(row.original);
        if (start && end) {
          return (
            <div className="text-sm whitespace-nowrap">
              <div>od: {formatDate(start, 'date')}</div>
              <div>do: {formatDate(end, 'date')}</div>
            </div>
          );
        }
        return '-';
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 129,
    },
    {
      header: 'Data rejsu',
      cell: ({ row }) => {
        if (row.original.startDate && row.original.endDate) {
          return (
            <div className="text-sm whitespace-nowrap">
              <div>od: {formatDate(row.original.startDate, 'date')}</div>
              <div>do: {formatDate(row.original.endDate, 'date')}</div>
            </div>
          );
        }
        return '-';
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 110,
    },
    {
      id: 'cruiseManager',
      header: 'Kierownik',
      accessorFn: (row) => getPersonName(row.mainManager),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar
            fullName={`${row.original.mainManager.firstName} ${row.original.mainManager.lastName}`}
            variant="small"
          />
          <span>{getPersonName(row.original.mainManager)}</span>
        </div>
      ),
      enableSorting: false,
      meta: {
        filterOptions: cruiseManagerFilterOptions,
        getFilterOptionLabel: (value) => managerLabels.get(value) ?? value,
      },
      size: 155,
    },
    {
      header: 'Formularze',
      cell: ({ row }) => {
        const isFormBReadOnly = !canRevertFormB(row.original.status);
        return (
          <div className="flex flex-col gap-1">
            <Link disabled={!row.original.hasFormA} href={`/applications/${row.original.id}/formA`}>
              Formularz A
            </Link>
            <Link
              disabled={!row.original.hasFormB}
              href={`/applications/${row.original.id}/formB?mode=${isFormBReadOnly ? 'view' : 'preview'}`}
            >
              Formularz B
            </Link>
            <Link disabled={!row.original.hasFormC} href={`/applications/${row.original.id}/formC`}>
              Formularz C
            </Link>
          </div>
        );
      },
      size: 112,
    },
    {
      header: 'Punkty',
      accessorFn: (row) => `${row.points} pkt.`,
      cell: ({ row }) => <Badge>{row.original.points} pkt.</Badge>,
      enableSorting: false,
      enableColumnFilter: false,
      size: 87,
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: (row) => row.status,
      enableSorting: false,
      meta: {
        filterOptions: statusFilterOptions,
        getFilterOptionLabel: (value) => getApplicationStatusLabel(value as CruiseApplicationStatus),
      },
      cell: ({ row }) => (
        <>
          <p className="mb-2 text-right italic sm:text-center">
            {getApplicationStatusLabel(row.original.status)}
            {row.original.status === CruiseApplicationStatus.enum.draft && row.original.note?.trim()
              ? ` (${row.original.note.trim()})`
              : null}
          </p>
          {row.original.invalidStoredValues.length > 0 && (
            <p className="mb-2 text-center text-xs font-medium text-danger-dark">
              Niepoprawne dane: {row.original.invalidStoredValues.join(', ')}
            </p>
          )}
          {row.original.status === CruiseApplicationStatus.enum.draft && (
            <Button
              className="ml-auto sm:mx-auto"
              size="sm"
              type="link"
              href={`/applications/${row.original.id}/formA?mode=edit`}
            >
              Kontynuuj wypełnianie
            </Button>
          )}
          {row.original.status === CruiseApplicationStatus.enum.formBRequired && (
            <Guard allowedUserIds={[row.original.mainManager.id, row.original.deputyManager.id]}>
              <Button
                className="ml-auto sm:mx-auto"
                size="sm"
                type="link"
                href={`/applications/${row.original.id}/formB?mode=edit`}
              >
                Wypełnij
              </Button>
            </Guard>
          )}
          {row.original.status === CruiseApplicationStatus.enum.undertaken && (
            <div className="flex flex-col items-center gap-2">
              <Guard allowedUserIds={[row.original.mainManager.id, row.original.deputyManager.id]}>
                <Button
                  className="ml-auto sm:mx-auto"
                  size="sm"
                  type="link"
                  href={`/applications/${row.original.id}/formC?mode=edit`}
                >
                  Wypełnij formularz C
                </Button>
              </Guard>
              <div>
                {row.original.effectsDoneRate === '0' ? (
                  <Badge variant="info">Brak zapisanych efektów</Badge>
                ) : (
                  <Badge variant="success">{row.original.effectsDoneRate} efektów</Badge>
                )}
              </div>
            </div>
          )}
        </>
      ),
      size: 129,
    },
    {
      header: 'Akcje',
      cell: ({ row }) => (
        <>
          <Button type="link" size="sm" href={`/applications/${row.original.id}/details`} className="flex gap-2">
            Szczegóły
            <MagnifyingGlassPlusIcon className="h-4 w-4" />
          </Button>
        </>
      ),
      size: 128,
    },
  ];

  if (applicationsQuery.isPending) {
    return <Loader />;
  }

  return (
    <>
      <Layout title="Zgłoszenia" variant="wide">
        <Table
          data={applications}
          virtualized
          getRowId={(application) => application.id}
          columns={columns}
          buttons={(defaultButtons) => [...defaultButtons]}
          sortingState={sorting}
          setSortingState={(updater) =>
            setSorting((previous) => {
              const next = functionalUpdate(updater, previous);
              return next.length ? next : DEFAULT_SORTING_STATE;
            })
          }
          enableMultiSort={false}
          manualSorting
          manualFiltering
          columnFiltersState={columnFilters}
          setColumnFiltersState={setColumnFilters}
          infiniteScroll={{
            hasNextPage: applicationsQuery.hasNextPage,
            isFetchingNextPage: applicationsQuery.isFetchingNextPage,
            isFetching: applicationsQuery.isFetching,
            pageCount: applicationsQuery.data?.pages.length ?? 0,
            fetchNextPage: () => void applicationsQuery.fetchNextPage(),
          }}
        />
      </Layout>
    </>
  );
}
