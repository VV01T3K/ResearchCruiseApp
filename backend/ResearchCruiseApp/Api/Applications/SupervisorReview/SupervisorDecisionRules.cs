using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

public static class SupervisorDecisionRules
{
    public static SupervisorDecisionResult Decide(CruiseApplication application, bool accept)
    {
        if (application.Status == CruiseApplicationStatus.Denied)
            return SupervisorDecisionResult.RejectedByOffice;

        if (
            application.Status
            is CruiseApplicationStatus.AcceptedBySupervisor
                or CruiseApplicationStatus.DeniedBySupervisor
        )
            return SupervisorDecisionResult.AlreadyAnswered;

        if (application.Status != CruiseApplicationStatus.WaitingForSupervisor)
            return SupervisorDecisionResult.ReviewClosed;

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
    ReviewClosed,
}
