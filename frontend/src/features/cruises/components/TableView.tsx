import { ColumnDef } from '@/integrations/tanstack/table/features';
import { MagnifyingGlassPlusIcon, TrashIcon } from '@phosphor-icons/react';

import { Badge } from '@/components/shared/Badge';
import { Button, ButtonLink } from '@/components/shared/Button';
import { Guard } from '@/components/shared/Guard';
import { Table } from '@/components/shared/table/Table';
import { useWindowSize } from '@/hooks/shared/WindowSizeHook';
import { Role } from '@/integrations/auth/types';
import { isInRole, useCurrentUser } from '@/integrations/tanstack/query/auth';
import { formatDate } from '@/lib/dateUtils';
import { getPersonName, isUnassignedPerson } from '@/lib/applications/person';
import { ManagerCell } from './ManagerCell';
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
  const { width } = useWindowSize();
  const columns: ColumnDef<CruiseResponse>[] = [
    {
      header: 'Numer',
      id: 'number',
      accessorFn: (row) => row.number,
      sortFn: (a, b) => compareCruiseNumber(a.original.number, b.original.number),
      cell: (cell) => <span className="font-bold">{cell.getValue() as string}</span>,
      size: 100,
    },
    {
      header: 'Tytuł',
      id: 'title',
      accessorFn: (row) => row.title ?? 'Brak tytułu',
      cell: ({ row }) => (
        <TitleBadge title={row.original.title ?? undefined} shipUnavailable={row.original.shipUnavailable} />
      ),
      size: 88,
    },
    {
      header: 'Data rozpoczęcia',
      accessorFn: (row) => row.startDate,
      cell: (cell) => (
        <span className="inline-flex flex-wrap justify-center gap-x-1">
          {formatDate(cell.getValue() as string, 'dateTime')
            .split(' ')
            .map((part) => (
              <span key={part}>{part}</span>
            ))}
        </span>
      ),
      enableColumnFilter: false,
      size: 112,
    },
    {
      header: 'Data zakończenia',
      accessorFn: (row) => row.endDate,
      cell: (cell) => (
        <span className="inline-flex flex-wrap justify-center gap-x-1">
          {formatDate(cell.getValue() as string, 'dateTime')
            .split(' ')
            .map((part) => (
              <span key={part}>{part}</span>
            ))}
        </span>
      ),
      enableColumnFilter: false,
      size: 112,
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      size: 104,
    },
    {
      header: 'Kierownik główny',
      accessorFn: (row) => getPersonName(row.mainManager) || 'Nie przypisano',
      cell: (context) => (
        <ManagerCell
          context={context}
          avatarName={
            isUnassignedPerson(context.row.original.mainManager)
              ? ''
              : `${context.row.original.mainManager.firstName} ${context.row.original.mainManager.lastName}`
          }
        />
      ),
      size: 128,
    },
    ...(isInRole(currentUser, [Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew])
      ? [
          {
            header: 'Zgłoszenia',
            cell: ({ row }) => <ApplicationsCell applications={row.original.applications} />,
            // Narrow enough to fit 1100px; from 1400px the spare width keeps the application link on one line.
            size: width >= 1400 ? 240 : 108,
          } satisfies ColumnDef<CruiseResponse>,
        ]
      : []),
    {
      id: 'actions',
      header: () => <span className="sr-only">Akcje</span>,
      cell: ({ row }) => <ActionsCell cruise={row.original} deleteCruise={deleteCruise} />,
      size: 136,
    },
  ];
  return (
    <Table
      columns={columns}
      data={cruises}
      virtualized
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
    return <Badge variant="info">Brak zgłoszeń</Badge>;
  }
  return (
    <div className="flex flex-col items-center gap-4 text-balance">
      {applications.map((application) => (
        <div className="flex flex-col gap-2" key={application.id}>
          <ButtonLink
            to="/applications/$applicationId/details"
            params={{ applicationId: application.id }}
            variant="primaryOutline"
            size="sm"
          >
            <div className="flex w-full flex-wrap items-center justify-around gap-2">
              <div>Zgłoszenie nr.{application.number}</div> <Badge>{application.points} pkt.</Badge>
            </div>
          </ButtonLink>
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
      <ButtonLink
        variant="primary"
        size="sm"
        to="/cruises/$cruiseId"
        params={{ cruiseId: cruise.id }}
        className="w-full !justify-center"
      >
        Szczegóły
        <MagnifyingGlassPlusIcon className="h-4 w-4" />
      </ButtonLink>
      <Guard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {(cruise.status === 'new' || cruise.status === 'confirmed') && (
          <Button
            variant="dangerOutline"
            size="sm"
            className="w-full !justify-center"
            onClick={() => deleteCruise(cruise)}
          >
            Usuń
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </Guard>
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
