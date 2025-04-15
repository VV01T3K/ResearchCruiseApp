import { ColumnDef } from '@tanstack/react-table';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import ZoomInIcon from 'bootstrap-icons/icons/zoom-in.svg?react';
import dayjs from 'dayjs';

import { AppAvatar } from '@/core/components/AppAvatar';
import { AppBadge } from '@/core/components/AppBadge';
import { AppButton } from '@/core/components/AppButton';
import { AppGuard } from '@/core/components/AppGuard';
import { AppTable } from '@/core/components/table/AppTable';
import { Role } from '@/core/models/Role';
import { CruiseStatusBadge } from '@/cruise-schedule/components/CruiseStatusBadge';
import { CruiseApplicationShortInfoDto, CruiseDto } from '@/cruise-schedule/models/CruiseDto';

const emptyGuid = '00000000-0000-0000-0000-000000000000';
const dateFormat = 'DD.MM.YYYY, HH:mm';

type Props = {
  cruises: CruiseDto[];
  deleteCruise: (cruise: CruiseDto) => void;
  buttons: React.ReactNode[];
};
export function CruisesTable({ cruises, deleteCruise, buttons }: Props) {
  const columns: ColumnDef<CruiseDto>[] = [
    {
      header: 'Numer',
      id: 'number',
      accessorFn: (row) => row.number,
      sortingFn: (a, b) => compareCruiseNumber(a.original.number, b.original.number),
      cell: (cell) => <span className="font-bold">{cell.getValue() as string}</span>,
      size: 15,
    },
    {
      header: 'Data rozpoczęcia',
      accessorFn: (row) => row.startDate,
      cell: (cell) => dayjs(cell.getValue() as string).format(dateFormat),
      enableColumnFilter: false,
      size: 10,
    },
    {
      header: 'Data zakończenia',
      accessorFn: (row) => row.endDate,
      cell: (cell) => dayjs(cell.getValue() as string).format(dateFormat),
      enableColumnFilter: false,
      size: 10,
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      cell: ({ row }) => <CruiseStatusBadge status={row.original.status} />,
      size: 10,
    },
    {
      id: 'mainCruiseManagerAvatar',
      cell: ({ row }) =>
        row.original.mainCruiseManagerId !== emptyGuid ? (
          <AppAvatar
            fullName={`${row.original.mainCruiseManagerFirstName} ${row.original.mainCruiseManagerLastName}`}
            variant="small"
          />
        ) : null,
      size: 5,
    },
    {
      header: 'Kierownik główny',
      accessorFn: (row) =>
        row.mainCruiseManagerId !== emptyGuid
          ? `${row.mainCruiseManagerFirstName} ${row.mainCruiseManagerLastName}`
          : 'Nie przypisano',
      size: 10,
    },
    {
      header: 'Zgłoszenia',
      cell: ({ row }) => <ApplicationsCell applications={row.original.cruiseApplicationsShortInfo} />,
      size: 30,
    },
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
  applications: CruiseApplicationShortInfoDto[];
};
function ApplicationsCell({ applications }: ApplicationsCellProps) {
  if (!applications || applications.length === 0) {
    return <AppBadge variant="info">Brak zgłoszeń</AppBadge>;
  }
  return (
    <div className="flex flex-col gap-4 items-center text-balance">
      {applications.map((application) => (
        <div className="flex flex-col gap-2" key={application.id}>
          <AppButton type="link" href={`/applications/${application.id}/details`} variant="primaryOutline" size="sm">
            <div className="flex items-center justify-around gap-2 w-full">
              <div>Zgłoszenie nr.{application.number}</div> <AppBadge>{application.points} pkt.</AppBadge>
            </div>
          </AppButton>
        </div>
      ))}
    </div>
  );
}

type ActionsCellProps = {
  cruise: CruiseDto;
  deleteCruise: (CruiseDto: CruiseDto) => void;
};
function ActionsCell({ cruise, deleteCruise }: ActionsCellProps) {
  return (
    <div className="grid grid-cols-1 gap-2 min-w-30">
      <AppButton variant="primary" type="link" href={`/cruises/${cruise.id}`}>
        Szczegóły
        <ZoomInIcon className="ml-2 w-4 h-4" />
      </AppButton>
      <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {cruise.status === 'Nowy' && (
          <AppButton variant="dangerOutline" onClick={() => deleteCruise(cruise)}>
            Usuń
            <TrashIcon className="w-4 h-4" />
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
