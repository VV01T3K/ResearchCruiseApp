using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Enums;

namespace ResearchCruiseApp.Api.Applications;

public static class SupervisorDecisionRules
{
    public static SupervisorDecisionResult Decide(CruiseApplication application, bool accept)
    {
        if (application.Status == CruiseApplicationStatus.Denied)
            return SupervisorDecisionResult.RejectedByOffice;

        if (application.Status != CruiseApplicationStatus.WaitingForSupervisor)
            return SupervisorDecisionResult.AlreadyAnswered;

        application.Status = accept
            ? CruiseApplicationStatus.AcceptedBySupervisor
            : CruiseApplicationStatus.DeniedBySupervisor;

        return SupervisorDecisionResult.Applied;
    }
}

public enum SupervisorDecisionResult
{
    Applied,
    RejectedByOffice,
    AlreadyAnswered,
}
