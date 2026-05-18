using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Domain.Logic;

public static class FormWorkflowRules
{
    public static void CompleteFormB(CruiseApplication application)
    {
        application.Status =
            application.Cruise is not null && application.Cruise.Status == CruiseStatus.Ended
                ? CruiseApplicationStatus.Undertaken
                : CruiseApplicationStatus.FormBFilled;
    }

    public static bool CanRefillFormB(CruiseApplicationStatus status)
    {
        return status is CruiseApplicationStatus.Undertaken or CruiseApplicationStatus.FormBFilled;
    }
}
