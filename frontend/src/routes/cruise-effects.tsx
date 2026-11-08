import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import { Alert } from '@/components/shared/Alert';
import { Badge } from '@/components/shared/Badge';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Table } from '@/components/shared/table/Table';
import { ResearchTaskDetails } from '@/features/applications/components/tasks/readonly/ResearchTaskDetails';
import { useGetCurrentUserCruiseEffectsSuspense } from '@/api/generated/endpoints/users.gen';
import { getTaskName } from '@/features/applications/schemas/types/ResearchTaskValues';
import type { CruiseEffectsResponse } from '@/api/generated/schemas';
import { mapResearchTaskToValues } from '@/features/applications/schemas/formA.schema';

export const Route = createFileRoute('/cruise-effects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
});

function mapEffectsToValues({ items, skippedCount }: CruiseEffectsResponse) {
  return {
    skippedCount,
    items: items.map(({ effect, ...response }) => ({ ...response, effect: mapResearchTaskToValues(effect) })),
  };
}

function CruiseEffectsPage() {
  const effectsQuery = useGetCurrentUserCruiseEffectsSuspense({ query: { select: mapEffectsToValues } });

  const columns: ColumnDef<ReturnType<typeof mapEffectsToValues>['items'][number]>[] = [
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
      cell: ({ row }) => <Badge>{row.original.points} pkt.</Badge>,
      size: 10,
    },
    {
      header: 'Formularz',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Link to="/applications/$applicationId/formC" params={{ applicationId: row.original.cruiseApplicationId }}>
            Formularz C
          </Link>
        </div>
      ),
      size: 10,
    },
  ];

  return (
    <>
      <Layout title="Efekty rejsów">
        {effectsQuery.data.skippedCount > 0 && (
          <div className="mb-4">
            <Alert variant="warning">
              Pominięte efekty: {effectsQuery.data.skippedCount}. Ich formularz C nie jest powiązany z żadnym
              zgłoszeniem, więc nie są też liczone do punktacji.
            </Alert>
          </div>
        )}
        <Table
          data={effectsQuery.data.items}
          columns={columns}
          emptyTableMessage="Nie znaleziono żadnego efektu rejsu"
        />
      </Layout>
    </>
  );
}
