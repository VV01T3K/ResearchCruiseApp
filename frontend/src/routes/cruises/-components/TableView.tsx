import { ColumnDef } from '@/integrations/tanstack/table/features';
import { MagnifyingGlassPlusIcon, TrashIcon } from '@phosphor-icons/react';

import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { AppGuard } from '@/components/shared/AppGuard';
import { AppTable } from '@/components/shared/table/AppTable';
import { Role } from '@/integrations/auth/types';
import { isInRole, useCurrentUser } from '@/integrations/tanstack/query/auth';
import { formatDate } from '@/lib/dateUtils';
import { getPersonName, isUnassignedPerson } from '@/lib/applications/person';
import { StatusBadge } from './StatusBadge';
import { TitleBadge } from './TitleBadge';
import type {
  ApplicationSummaryResponse as CruiseApplicationSummaryResponse,
  CruiseResponse,
} from '@/api/generated/schemas';

type Props = {
  cruises: CruiseResponse[];
  deleteCruise: (cruise: CruiseResponse) => void;
  buttons: React.ReactNode[];
};
export function TableView({ cruises, deleteCruise, buttons }: Props) {
  const currentUser = useCurrentUser();
  const columns: ColumnDef<CruiseResponse>[] = [
    {
      header: 'Numer',
      id: 'number',
      accessorFn: (row) => row.number,
      sortFn: (a, b) => compareCruiseNumber(a.original.number, b.original.number),
      cell: (cell) => <span className="font-bold">{cell.getValue() as string}</span>,
      size: 5,
    },
    {
      header: 'Tytuł',
      id: 'title',
      accessorFn: (row) => row.title ?? 'Brak tytułu',
      cell: ({ row }) => (
        <TitleBadge title={row.original.title ?? undefined} shipUnavailable={row.original.shipUnavailable} />
      ),
      size: 10,
    },
    {
      header: 'Data rozpoczęcia',
      accessorFn: (row) => row.startDate,
      cell: (cell) => formatDate(cell.getValue() as string, 'dateTime'),
      enableColumnFilter: false,
      size: 10,
    },
    {
      header: 'Data zakończenia',
      accessorFn: (row) => row.endDate,
      cell: (cell) => formatDate(cell.getValue() as string, 'dateTime'),
      enableColumnFilter: false,
      size: 10,
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      size: 10,
    },
    {
      id: 'mainCruiseManagerAvatar',
      cell: ({ row }) =>
        !isUnassignedPerson(row.original.mainManager) ? (
          <AppAvatar
            fullName={`${row.original.mainManager.firstName} ${row.original.mainManager.lastName}`}
            variant="small"
          />
        ) : null,
      size: 5,
    },
    {
      header: 'Kierownik główny',
      accessorFn: (row) => getPersonName(row.mainManager) || 'Nie przypisano',
      size: 10,
    },
    ...(isInRole(currentUser, [Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew])
      ? [
          {
            header: 'Zgłoszenia',
            cell: ({ row }) => <ApplicationsCell applications={row.original.applications} />,
            size: 30,
          } satisfies ColumnDef<CruiseResponse>,
        ]
      : []),
    {
      id: 'actions',
      cell: ({ row }) => <ActionsCell cruise={row.original} deleteCruise={deleteCruise} />,
      size: 10,
    },
  ];
  return (
    <AppTable
      columns={columns}
      data={cruises}
      buttons={(predefinedButtons) => buttons.concat(predefinedButtons)}
      initialSortingState={[
        {
          id: 'number',
          desc: true,
        },
      ]}
    />
  );
}

type ApplicationsCellProps = {
  applications: CruiseApplicationSummaryResponse[];
};
function ApplicationsCell({ applications }: ApplicationsCellProps) {
  if (!applications || applications.length === 0) {
    return <AppBadge variant="info">Brak zgłoszeń</AppBadge>;
  }
  return (
    <div className="flex flex-col items-center gap-4 text-balance">
      {applications.map((application) => (
        <div className="flex flex-col gap-2" key={application.id}>
          <AppButton type="link" href={`/applications/${application.id}/details`} variant="primaryOutline" size="sm">
            <div className="flex w-full items-center justify-around gap-2">
              <div>Zgłoszenie nr.{application.number}</div> <AppBadge>{application.points} pkt.</AppBadge>
            </div>
          </AppButton>
        </div>
      ))}
    </div>
  );
}

type ActionsCellProps = {
  cruise: CruiseResponse;
  deleteCruise: (cruise: CruiseResponse) => void;
};
function ActionsCell({ cruise, deleteCruise }: ActionsCellProps) {
  return (
    <div className="grid min-w-30 grid-cols-1 gap-2">
      <AppButton variant="primary" type="link" size="sm" href={`/cruises/${cruise.id}`}>
        Szczegóły
        <MagnifyingGlassPlusIcon className="ml-2 h-4 w-4" />
      </AppButton>
      <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {cruise.status === 'new' && (
          <AppButton variant="dangerOutline" size="sm" onClick={() => deleteCruise(cruise)}>
            Usuń
            <TrashIcon className="h-4 w-4" />
          </AppButton>
        )}
      </AppGuard>
    </div>
  );
}

function compareCruiseNumber(a: string, b: string) {
  const [aYear, aNumber] = a.split('/').map(Number);
  const [bYear, bNumber] = b.split('/').map(Number);

  if (aYear !== bYear) {
    return aYear - bYear;
  }
  return aNumber - bNumber;
}
