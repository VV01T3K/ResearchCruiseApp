import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { ColumnDef } from '@tanstack/react-table';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppTable } from '@/components/shared/table/AppTable';
import { ResearchTaskDetails } from '@/routes/applications/$applicationId/-components/research-task-display/readonly/ResearchTaskDetails';
import { useGetCurrentUserCruiseEffectsSuspense } from '@/api/generated/endpoints/users.gen';
import { getTaskName } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { CruiseEffectView } from '@/api/client/applications/types/CruiseEffectView';
import { mapResearchTaskToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

export const Route = createFileRoute('/cruise-effects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruiseEffectsPage() {
  const effectsQuery = useGetCurrentUserCruiseEffectsSuspense({
    query: {
      select: (effects): CruiseEffectView[] =>
        effects.map(({ effect, ...cruiseEffect }) => ({
          ...cruiseEffect,
          effect: {
            ...mapResearchTaskToValues(effect),
            done: effect.done === 'true',
            managerConditionMet: effect.managerConditionMet === 'true',
            deputyConditionMet: effect.deputyConditionMet === 'true',
          },
        })),
    },
  });

  const columns: ColumnDef<CruiseEffectView>[] = [
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
