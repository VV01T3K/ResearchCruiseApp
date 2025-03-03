import { useQueryClient } from '@tanstack/react-query';

import { useAppContext } from '@/core/hooks/AppContextHook';
import { ApplicationDetailsProvider } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { useRejectApplicationMutation } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
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
  const appContext = useAppContext();
  const queryClient = useQueryClient();

  const rejectMutation = useRejectApplicationMutation();

  function rejectApplication() {
    rejectMutation.mutate(application.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cruiseApplications', application.id] });
        appContext.showAlert({
          title: 'Formularz pomyślnie odrzucony',
          message: 'Formularz został odrzucony.',
          variant: 'success',
        });
      },
      onError: (err) => {
        console.error(err);
        appContext.showAlert({
          title: 'Wystąpił błąd',
          message: 'Nie udało się odrzucić formularza.',
          variant: 'danger',
        });
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
      <ApplicationDetailsActionsSection onReject={rejectApplication} />
    </ApplicationDetailsProvider>
  );
}
