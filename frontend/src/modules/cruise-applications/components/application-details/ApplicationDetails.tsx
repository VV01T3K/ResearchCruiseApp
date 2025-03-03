import { CruiseApplicationDto } from "@/cruise-applications/models/CruiseApplicationDto";
import { EvaluationDto } from "@/cruise-applications/models/EvaluationDto";
import { ApplicationDetailsInformationSection } from "./ApplicationDetailsInformationSection";
import { ApplicationDetailsResearchTasksSection } from "./ApplicationDetailsResearchTasksSection";
import { ApplicationDetailsEffectPointsSection } from "./ApplicationDetailsEffectPointsSection";
import { ApplicationDetailsContractsSection } from "./ApplicationDetailsContractsSection";
import { ApplicationDetailsMembersSection } from "./ApplicationDetailsMembersSection";
import { ApplicationDetailsPublicationsSection } from "./ApplicationDetailsPublicationsSection";
import { ApplicationDetailsSPUBTasksSection } from "./ApplicationDetailsSPUBTasksSection";
import { ApplicationDetailsActionsSection } from "./ApplicationDetailsActionsSection";
import { useAppContext } from "@/core/hooks/AppContextHook";
import { useRejectApplicationMutation } from "@/cruise-applications/hooks/CruiseApplicationsApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { ApplicationDetailsProvider } from "@/cruise-applications/contexts/ApplicationDetailsContext";

type Props = {
  application: CruiseApplicationDto;
  evaluation: EvaluationDto;
}
export function ApplicationDetails({application, evaluation}: Props) {
    const appContext = useAppContext();
    const queryClient = useQueryClient();

    const rejectMutation = useRejectApplicationMutation();

    function rejectApplication () {
      rejectMutation.mutate(
        application.id,
        {
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
        }
      );
    };

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
