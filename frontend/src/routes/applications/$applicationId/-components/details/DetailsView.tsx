import { toast } from '@/components/shared/layout/toast';
import { ApplicationDetailsProvider } from '@/contexts/applications/ApplicationDetailsContext';
import { useUpdateApplicationDecision } from '@/api/generated/endpoints/applications.gen';
import { ApplicationResponse, EvaluationResponse } from '@/api/client/applications/models';

import { ActionsSection } from './ActionsSection';
import { ContractsSection } from './ContractsSection';
import { EffectPointsSection } from './EffectPointsSection';
import { InformationSection } from './InformationSection';
import { MembersSection } from './MembersSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { SPUBTasksSection } from './SPUBTasksSection';

type Props = {
  application: ApplicationResponse;
  evaluation: EvaluationResponse;
};
export function DetailsView({ application, evaluation }: Props) {
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
    <ApplicationDetailsProvider value={{ application, evaluation }}>
      <InformationSection />
      <ResearchTasksSection />
      <EffectPointsSection />
      <ContractsSection />
      <MembersSection />
      <PublicationsSection />
      <SPUBTasksSection />
      <ActionsSection onAccept={acceptApplication} onReject={rejectApplication} />
    </ApplicationDetailsProvider>
  );
}
