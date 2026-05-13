import { useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/shared/layout/toast';
import { ApplicationDetailsProvider } from '@/contexts/applications/ApplicationDetailsContext';
import {
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} from '@/api/hooks/applications/CruiseApplicationsApiHooks';
import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { EvaluationDto } from '@/api/dto/applications/EvaluationDto';

import { ActionsSection } from './ActionsSection';
import { ContractsSection } from './ContractsSection';
import { EffectPointsSection } from './EffectPointsSection';
import { InformationSection } from './InformationSection';
import { MembersSection } from './MembersSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { SPUBTasksSection } from './SPUBTasksSection';

type Props = {
  application: CruiseApplicationDto;
  evaluation: EvaluationDto;
};
export function DetailsView({ application, evaluation }: Props) {
  const queryClient = useQueryClient();

  const acceptMutation = useAcceptApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();

  function acceptApplication() {
    acceptMutation.mutate(application.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cruiseApplications', application.id] });
        toast.success('Formularz został zaakceptowany');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Nie udało się zaakceptować formularza');
      },
    });
  }

  function rejectApplication() {
    rejectMutation.mutate(application.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cruiseApplications', application.id] });
        toast.success('Formularz został odrzucony');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Nie udało się odrzucić formularza');
      },
    });
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
