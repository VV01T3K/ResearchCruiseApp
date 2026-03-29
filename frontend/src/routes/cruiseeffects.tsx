import { createFileRoute } from '@tanstack/react-router';

import { ColumnDef } from '@tanstack/react-table';

import { AppBadge } from '@/components/AppBadge';
import { AppLayout } from '@/components/AppLayout';
import { AppLink } from '@/components/AppLink';
import { AppTable } from '@/components/table/AppTable';
import { ReadOnlyResearchTaskDetails } from '@/features/cruise-applications/components/common/readonly-research-task-details/ReadOnlyResearchTaskDetails';
import { useEffectsEvaluationsQuery } from '@/features/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { getTaskName } from '@/features/cruise-applications/models/ResearchTaskDto';
import { UserEffectDto } from '@/features/cruise-applications/models/UserEffectDto';
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
