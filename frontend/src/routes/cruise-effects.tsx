import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { ColumnDef } from '@tanstack/react-table';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppTable } from '@/components/shared/table/AppTable';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { useCurrentCruiseEffectsQuery } from '@/api/users/CurrentUserApiHooks';
import { getTaskName } from '@/api/applications/dto/ResearchTaskDto';
import { UserEffectDto } from '@/api/applications/dto/UserEffectDto';

export const Route = createFileRoute('/cruise-effects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruiseEffectsPage() {
  const effectsQuery = useCurrentCruiseEffectsQuery();

  const columns: ColumnDef<UserEffectDto>[] = [
    {
      header: 'Lp.',
      cell: ({ row }) => `${row.index + 1}`,
      size: 5,
    },
    {
      header: 'Zadanie',
      accessorFn: (row) => `${getTaskName(row.effect.type)}`,
      size: 20,
    },
    {
      header: 'Szczegóły',
      cell: ({ row }) => <ResearchTaskDetails data={row.original.effect} />,
    },
    {
      header: 'Punkty',
      accessorFn: (row) => `${row.points} pkt.`,
      cell: ({ row }) => <AppBadge>{row.original.points} pkt.</AppBadge>,
      size: 10,
    },
    {
      header: 'Formularz',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <AppLink href={`/applications/${row.original.cruiseApplicationId}/formC`}>Formularz C</AppLink>
        </div>
      ),
      size: 10,
    },
  ];

  return (
    <>
      <AppLayout title="Efekty rejsów">
        <AppTable data={effectsQuery.data} columns={columns} emptyTableMessage="Nie znaleziono żadnego efektu rejsu" />
      </AppLayout>
    </>
  );
}
