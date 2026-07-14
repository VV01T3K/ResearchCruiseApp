import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import BoxArrowUpRightIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import { useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppGuard } from '@/components/shared/AppGuard';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { AppTabs } from '@/components/shared/AppTabs';
import { toast } from '@/components/shared/layout/toast';
import { Role } from '@/types/user';
import { Calendar } from './-components/Calendar';
import { ExportForm } from './-components/ExportForm';
import { TableView } from './-components/TableView';
import { useAutoPlanCruises, useDeleteCruise, useGetCruisesSuspense } from '@/api/generated/endpoints/cruises.gen';
import type { CruiseResponse } from '@/api/generated/schemas';

export const Route = createFileRoute('/cruises/')({
  component: CruisesPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruisesPage() {
  const cruisesQuery = useGetCruisesSuspense();
  const deleteCruiseMutation = useDeleteCruise();
  const autoAddCruisesMutation = useAutoPlanCruises();

  const [cruiseSelectedForDeletion, setCruiseSelectedForDeletion] = useState<CruiseResponse | undefined>(undefined);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  async function autoAddCruises() {
    await autoAddCruisesMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Rejsy zostały dodane automatycznie');
      },
      onError: () => {
        toast.error('Proces dodawania rejsów automatycznie zakończył się niepowodzeniem');
      },
    });
  }

  const buttons = [
    <AppGuard key="autoAddCruises" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <AppButton onClick={autoAddCruises} variant="primaryOutline">
        Dodaj rejsy automatycznie
      </AppButton>
    </AppGuard>,
    <AppGuard key="newCruise" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <AppButton type="link" href="/cruises/new">
        Nowy rejs
        <PlusLgIcon className="ml-2 h-6 w-6" />
      </AppButton>
    </AppGuard>,
    <AppGuard key="newBlockade" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <AppButton type="link" href="/cruises/new?blockade=true" variant="primaryOutline">
        Nowa blokada
        <PlusLgIcon className="ml-2 h-6 w-6" />
      </AppButton>
    </AppGuard>,
    <AppGuard key="exportCruises" allowedRoles={[Role.ShipOwner, Role.Administrator]}>
      <AppButton onClick={() => setIsExportModalOpen(true)} variant="primaryOutline">
        Eksport
        <BoxArrowUpRightIcon className="ml-2 h-4 w-4" />
      </AppButton>
    </AppGuard>,
  ];

  return (
    <>
      <AppLayout title="Rejsy">
        <AppTabs tabNames={['Lista rejsów', 'Kalendarz']}>
          <TableView cruises={cruisesQuery.data} buttons={buttons} deleteCruise={setCruiseSelectedForDeletion} />
          <Calendar cruises={cruisesQuery.data} buttons={buttons} />
        </AppTabs>
      </AppLayout>

      <AppModal
        title={`Potwierdź usunięcie rejsu nr. ${cruiseSelectedForDeletion?.number}`}
        isOpen={!!cruiseSelectedForDeletion}
        onClose={() => setCruiseSelectedForDeletion(undefined)}
      >
        Usunięcie rejsu jest nieodwracalne.
        <div className="mt-4 flex flex-row gap-4">
          <AppButton
            variant="danger"
            className="basis-2/3"
            onClick={async () => {
              await deleteCruiseMutation.mutateAsync({ cruiseId: cruiseSelectedForDeletion!.id });
              setCruiseSelectedForDeletion(undefined);
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Usuń rejs nr. {cruiseSelectedForDeletion?.number}
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setCruiseSelectedForDeletion(undefined);
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>

      <AppModal title={`Eksportuj rejsy`} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
        <ExportForm cruises={cruisesQuery.data} onDone={() => setIsExportModalOpen(false)} />
      </AppModal>
    </>
  );
}
