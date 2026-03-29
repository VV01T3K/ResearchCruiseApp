import { createFileRoute } from '@tanstack/react-router';

import { ColumnDef } from '@tanstack/react-table';

import { AppBadge } from '@/components/shared/AppBadge';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppTable } from '@/components/shared/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/components/applications/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useEffectsEvaluationsQuery } from '@/api/hooks/applications/CruiseApplicationsApiHooks';
import { getTaskName } from '@/api/dto/applications/ResearchTaskDto';
import { UserEffectDto } from '@/api/dto/applications/UserEffectDto';
import { allowOnly } from '@/lib/guards';

export const Route = createFileRoute('/cruiseeffects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruiseEffectsPage() {
  const effectsQuery = useEffectsEvaluationsQuery();

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
      cell: ({ row }) => <ReadOnlyResearchTaskDetails data={row.original.effect} />,
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
    <AppLayout title="Efekty rejsów">
      <AppTable data={effectsQuery.data} columns={columns} emptyTableMessage="Nie znaleziono żadnego efektu rejsu" />
    </AppLayout>
  );
}
