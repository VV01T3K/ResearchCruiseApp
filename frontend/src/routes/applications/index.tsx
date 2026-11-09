import { useGetApplicationManagersSuspense } from '@/api/generated/endpoints/applications.gen';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { ColumnFiltersState, functionalUpdate } from '@tanstack/react-table';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { MagnifyingGlassPlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { ManagerCell } from '@/features/cruises/components/ManagerCell';
import { Badge } from '@/components/shared/Badge';
import { ButtonLink } from '@/components/shared/Button';
import { Guard } from '@/components/shared/Guard';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { Table } from '@/components/shared/table/Table';
import { getDisplayPeriod } from '@/lib/applications/periodUtils';
import { formatCruiseLength } from '@/features/applications/components/formA/cruisePeriodExplanation';
import { formatDate, useNow } from '@/lib/dateUtils';
import { useCruiseApplicationsInfiniteQuery } from '@/features/applications/hooks/useApplications';
import { ApplicationResponse, CruiseApplicationStatus } from '@/api/generated/schemas';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { getPersonName } from '@/lib/applications/person';
import { canRevertFormB, getApplicationStatusLabel } from '@/lib/applications/status';

const defaultSort = { sortBy: 'number', descending: true } as const;

const searchSchema = z.object({
  number: z.int32().optional().catch(undefined),
  date: z.iso
    .date()
    .refine((date) => date >= '2000-01-01')
    .optional()
    .catch(undefined),
  year: z.array(z.int32()).max(50).optional().catch(undefined),
  status: z.array(CruiseApplicationStatus).max(50).optional().catch(undefined),
  cruiseManager: z.array(z.guid()).max(50).optional().catch(undefined),
  sortBy: z.enum(['number', 'date', 'year']).default(defaultSort.sortBy).catch(defaultSort.sortBy),
  descending: z.boolean().default(defaultSort.descending).catch(defaultSort.descending),
});

export const Route = createFileRoute('/applications/')({
  component: ApplicationsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
  validateSearch: searchSchema,
  search: { middlewares: [stripSearchParams(defaultSort)] },
});

const statusFilterOptions = CruiseApplicationStatus.options;

const EARLIEST_APPLICATION_YEAR = 2024;
const YEAR_FILTER_OPTIONS_AHEAD = 3;

function ApplicationsPage() {
  const { sortBy, descending, ...filters } = Route.useSearch();
  const navigate = Route.useNavigate();
  const filter = {
    number: filters.number === undefined ? undefined : [filters.number],
    date: filters.date === undefined ? undefined : [filters.date],
    status: filters.status,
    year: filters.year,
    cruiseManager: filters.cruiseManager,
  };
  const columnFilters: ColumnFiltersState = Object.entries({
    ...filter,
    number: filter.number?.map(String),
    year: filter.year?.map(String),
  })
    .filter(([, value]) => value)
    .map(([id, value]) => ({ id, value }));
  const sorting = [{ id: sortBy, desc: descending }];
  const applicationsQuery = useCruiseApplicationsInfiniteQuery(filter, { sortBy, descending });
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
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.date, 'date')}</span>,
      sortDescFirst: true,
      meta: { filterInputType: 'date', getFilterOptionLabel: (value) => formatDate(value, 'date') },
      size: 92,
    },
    {
      id: 'year',
      header: 'Rok rejsu',
      accessorFn: (row) => row.year?.toString() ?? '-',
      sortDescFirst: true,
      meta: { filterOptions: yearFilterOptions },
      size: 90,
    },
    {
      header: 'Okres optymalny / dopuszczalny',
      cell: ({ row }) => {
        const { start, end } = getDisplayPeriod(row.original);
        return (
          <div className="text-sm whitespace-nowrap">
            {start && end ? (
              <>
                <div>od: {formatDate(start, 'date')}</div>
                <div>do: {formatDate(end, 'date')}</div>
              </>
            ) : (
              <div>-</div>
            )}
            {row.original.cruiseDays !== null && (
              <div className="mt-1 text-muted-foreground">
                <div>Czas trwania:</div>
                <div>{formatCruiseLength(Math.round(row.original.cruiseDays * 24))}</div>
              </div>
            )}
          </div>
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 106,
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
      size: 106,
    },
    {
      id: 'cruiseManager',
      header: 'Kierownik',
      accessorFn: (row) => getPersonName(row.mainManager),
      cell: (context) => (
        <ManagerCell
          context={context}
          avatarName={`${context.row.original.mainManager.firstName} ${context.row.original.mainManager.lastName}`}
        />
      ),
      enableSorting: false,
      meta: {
        filterOptions: cruiseManagerFilterOptions,
        getFilterOptionLabel: (value) => managerLabels.get(value) ?? value,
      },
      size: 120,
    },
    {
      header: 'Formularze',
      cell: ({ row }) => {
        const isFormBReadOnly = !canRevertFormB(row.original.status);
        return (
          <div className="flex flex-col gap-1">
            <Link
              disabled={!row.original.hasFormA}
              to="/applications/$applicationId/formA"
              params={{ applicationId: row.original.id }}
            >
              Formularz A
            </Link>
            <Link
              disabled={!row.original.hasFormB}
              to="/applications/$applicationId/formB"
              params={{ applicationId: row.original.id }}
              search={{ mode: isFormBReadOnly ? 'view' : 'preview' }}
            >
              Formularz B
            </Link>
            <Link
              disabled={!row.original.hasFormC}
              to="/applications/$applicationId/formC"
              params={{ applicationId: row.original.id }}
            >
              Formularz C
            </Link>
          </div>
        );
      },
      size: 102,
    },
    {
      header: 'Punkty',
      accessorFn: (row) => `${row.points} pkt.`,
      cell: ({ row }) => <Badge>{row.original.points} pkt.</Badge>,
      enableSorting: false,
      enableColumnFilter: false,
      size: 72,
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
            <ButtonLink
              className="ml-auto sm:mx-auto"
              size="sm"
              to="/applications/$applicationId/formA"
              params={{ applicationId: row.original.id }}
              search={{ mode: 'edit' }}
            >
              Kontynuuj wypełnianie
            </ButtonLink>
          )}
          {row.original.status === CruiseApplicationStatus.enum.formBRequired && (
            <Guard allowedUserIds={[row.original.mainManager.id, row.original.deputyManager.id]}>
              <ButtonLink
                className="ml-auto sm:mx-auto"
                size="sm"
                to="/applications/$applicationId/formB"
                params={{ applicationId: row.original.id }}
                search={{ mode: 'edit' }}
              >
                Wypełnij
              </ButtonLink>
            </Guard>
          )}
          {row.original.status === CruiseApplicationStatus.enum.undertaken && (
            <div className="flex flex-col items-center gap-2">
              <Guard allowedUserIds={[row.original.mainManager.id, row.original.deputyManager.id]}>
                <ButtonLink
                  className="ml-auto sm:mx-auto"
                  size="sm"
                  to="/applications/$applicationId/formC"
                  params={{ applicationId: row.original.id }}
                  search={{ mode: 'edit' }}
                >
                  Wypełnij formularz C
                </ButtonLink>
              </Guard>
              <div>
                {row.original.effectsDoneRate === '0' ? (
                  <Badge variant="info" className="whitespace-normal!">
                    Brak zapisanych efektów
                  </Badge>
                ) : (
                  <Badge variant="success">{row.original.effectsDoneRate} efektów</Badge>
                )}
              </div>
            </div>
          )}
        </>
      ),
      size: 112,
    },
    {
      header: 'Akcje',
      cell: ({ row }) => (
        <>
          <ButtonLink
            size="sm"
            to="/applications/$applicationId/details"
            params={{ applicationId: row.original.id }}
            className="mx-auto flex"
          >
            Szczegóły
            <MagnifyingGlassPlusIcon className="h-4 w-4" />
          </ButtonLink>
        </>
      ),
      size: 124,
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
          setSortingState={(updater) => {
            const [next] = functionalUpdate(updater, sorting);
            void navigate({
              search: (previous) => ({
                ...previous,
                sortBy: (next?.id ?? defaultSort.sortBy) as typeof sortBy,
                descending: next?.desc ?? defaultSort.descending,
              }),
              replace: true,
            });
          }}
          enableSortingRemoval={false}
          manualSorting
          manualFiltering
          columnFiltersState={columnFilters}
          setColumnFiltersState={(updater) => {
            const next = functionalUpdate(updater, columnFilters);
            const getValues = (id: string) => next.find((filter) => filter.id === id)?.value as string[] | undefined;
            void navigate({
              search: (previous) => ({
                ...previous,
                number: getValues('number')?.map(Number)[0],
                date: getValues('date')?.[0],
                year: getValues('year')?.map(Number),
                status: getValues('status') as CruiseApplicationStatus[] | undefined,
                cruiseManager: getValues('cruiseManager'),
              }),
              replace: true,
            });
          }}
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
