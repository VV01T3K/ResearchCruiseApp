import { toast } from '@/components/shared/layout/toast';
import { useUpdateApplicationDecision } from '@/api/generated/endpoints/applications.gen';
import { useApplication } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';

import { ActionsSection } from './ActionsSection';
import { ContractsSection } from './ContractsSection';
import { EffectPointsSection } from './EffectPointsSection';
import { InformationSection } from './InformationSection';
import { MembersSection } from './MembersSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { SPUBTasksSection } from './SPUBTasksSection';

export function DetailsView() {
  const application = useApplication();
  const decisionMutation = useUpdateApplicationDecision();

  function acceptApplication() {
    decisionMutation.mutate(
      { applicationId: application.id, data: { accept: true } },
      {
        onSuccess: () => {
          toast.success('Formularz został zaakceptowany');
        },
        onError: (err) => {
          console.error(err);
          toast.error('Nie udało się zaakceptować formularza');
        },
      }
    );
  }

  function rejectApplication() {
    decisionMutation.mutate(
      { applicationId: application.id, data: { accept: false } },
      {
        onSuccess: () => {
          toast.success('Formularz został odrzucony');
        },
        onError: (err) => {
          console.error(err);
          toast.error('Nie udało się odrzucić formularza');
        },
      }
    );
  }

  return (
    <>
      <InformationSection />
      <ResearchTasksSection />
      <EffectPointsSection />
      <ContractsSection />
      <MembersSection />
      <PublicationsSection />
      <SPUBTasksSection />
      <ActionsSection onAccept={acceptApplication} onReject={rejectApplication} />
    </>
  );
}
