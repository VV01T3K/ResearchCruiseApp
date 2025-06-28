import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ApplicationDetailsProvider } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import {
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
} from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { EvaluationDto } from '@/cruise-applications/models/EvaluationDto';

import { ApplicationDetailsActionsSection } from './ApplicationDetailsActionsSection';
import { ApplicationDetailsContractsSection } from './ApplicationDetailsContractsSection';
import { ApplicationDetailsEffectPointsSection } from './ApplicationDetailsEffectPointsSection';
import { ApplicationDetailsInformationSection } from './ApplicationDetailsInformationSection';
import { ApplicationDetailsMembersSection } from './ApplicationDetailsMembersSection';
import { ApplicationDetailsPublicationsSection } from './ApplicationDetailsPublicationsSection';
import { ApplicationDetailsResearchTasksSection } from './ApplicationDetailsResearchTasksSection';
import { ApplicationDetailsSPUBTasksSection } from './ApplicationDetailsSPUBTasksSection';

type Props = {
  application: CruiseApplicationDto;
  evaluation: EvaluationDto;
};
export function ApplicationDetails({ application, evaluation }: Props) {
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
      <ApplicationDetailsInformationSection />
      <ApplicationDetailsResearchTasksSection />
      <ApplicationDetailsEffectPointsSection />
      <ApplicationDetailsContractsSection />
      <ApplicationDetailsMembersSection />
      <ApplicationDetailsPublicationsSection />
      <ApplicationDetailsSPUBTasksSection />
      <ApplicationDetailsActionsSection onAccept={acceptApplication} onReject={rejectApplication} />
    </ApplicationDetailsProvider>
  );
}
