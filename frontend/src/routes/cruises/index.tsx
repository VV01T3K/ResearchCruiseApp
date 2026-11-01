import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { ArrowSquareOutIcon, PlusIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Guard } from '@/components/shared/Guard';
import { Layout } from '@/components/shared/Layout';
import { Modal } from '@/components/shared/Modal';
import { Tabs } from '@/components/shared/Tabs';
import { toast } from '@/components/shared/layout/toast';
import { Role } from '@/integrations/auth/types';
import { CruiseCalendar } from './-components/CruiseCalendar';
import { ExportForm } from './-components/ExportForm';
import { TableView } from './-components/TableView';
import {
  getGetCruisesQueryKey,
  useAutoPlanCruises,
  useDeleteCruise,
  useGetCruisesSuspense,
} from '@/api/generated/endpoints/cruises.gen';
import type { AutoPlanResponse, CruiseResponse } from '@/api/generated/schemas';

export const Route = createFileRoute('/cruises/')({
  component: CruisesPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruisesPage() {
  const cruisesQuery = useGetCruisesSuspense();
  const queryClient = useQueryClient();
  const refreshCruises = {
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() }) },
  };
  const deleteCruiseMutation = useDeleteCruise(refreshCruises);
  const autoAddCruisesMutation = useAutoPlanCruises(refreshCruises);

  const [cruiseSelectedForDeletion, setCruiseSelectedForDeletion] = useState<CruiseResponse | undefined>(undefined);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [autoPlanResult, setAutoPlanResult] = useState<AutoPlanResponse | undefined>(undefined);

  function autoAddCruises() {
    autoAddCruisesMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.skipped.length > 0) {
          setAutoPlanResult(result);
        } else if (result.plannedCount > 0) {
          toast.success(`Dodano automatycznie rejsy: ${result.plannedCount}.`);
        } else {
          toast.success('Brak zaakceptowanych zgłoszeń do zaplanowania.');
        }
      },
    });
  }

  const buttons = [
    <Guard key="autoAddCruises" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <Button onClick={autoAddCruises} variant="primaryOutline" disabled={autoAddCruisesMutation.isPending}>
        Dodaj rejsy automatycznie
      </Button>
    </Guard>,
    <Guard key="newCruise" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <Button type="link" href="/cruises/new">
        Nowy rejs
        <PlusIcon className="ml-2 h-6 w-6" />
      </Button>
    </Guard>,
    <Guard key="newBlockade" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <Button type="link" href="/cruises/new?blockade=true" variant="primaryOutline">
        Nowa blokada
        <PlusIcon className="ml-2 h-6 w-6" />
      </Button>
    </Guard>,
    <Guard key="exportCruises" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <Button onClick={() => setIsExportModalOpen(true)} variant="primaryOutline">
        Eksport
        <ArrowSquareOutIcon className="ml-2 h-4 w-4" />
      </Button>
    </Guard>,
  ];

  return (
    <>
      <Layout title="Rejsy">
        <Tabs tabNames={['Lista rejsów', 'Kalendarz']}>
          <TableView cruises={cruisesQuery.data} buttons={buttons} deleteCruise={setCruiseSelectedForDeletion} />
          <CruiseCalendar cruises={cruisesQuery.data} buttons={buttons} />
        </Tabs>
      </Layout>

      <Modal
        title={`Potwierdź usunięcie rejsu nr. ${cruiseSelectedForDeletion?.number}`}
        isOpen={!!cruiseSelectedForDeletion}
        onClose={() => setCruiseSelectedForDeletion(undefined)}
      >
        Usunięcie rejsu jest nieodwracalne. Rejs zostanie usunięty, a przypisane do niego zgłoszenia wrócą do statusu
        „Zaakceptowane” i będzie można je ponownie zaplanować.
        <div className="mt-4 flex flex-row gap-4">
          <Button
            variant="danger"
            className="basis-2/3"
            onClick={() => {
              if (!cruiseSelectedForDeletion) return;
              deleteCruiseMutation.mutate(
                { cruiseId: cruiseSelectedForDeletion.id, params: { revision: cruiseSelectedForDeletion.revision } },
                { onSuccess: () => setCruiseSelectedForDeletion(undefined) }
              );
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Usuń rejs nr. {cruiseSelectedForDeletion?.number}
          </Button>
          <Button
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setCruiseSelectedForDeletion(undefined);
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </Modal>

      <Modal
        title="Wynik automatycznego planowania"
        isOpen={!!autoPlanResult}
        onClose={() => setAutoPlanResult(undefined)}
      >
        <p>Dodano rejsy: {autoPlanResult?.plannedCount}. Pominięte zgłoszenia:</p>
        <ul className="mt-2 list-disc pl-6">
          {autoPlanResult?.skipped.map((application) => (
            <li key={application.applicationId}>
              Nr {application.applicationNumber}: {application.reason}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal title={`Eksportuj rejsy`} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
        <ExportForm cruises={cruisesQuery.data} onDone={() => setIsExportModalOpen(false)} />
      </Modal>
    </>
  );
}
