using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Enums;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationDecisionRules
{
    public static ApplicationDecisionResult Decide(CruiseApplication application, bool accept)
    {
        if (
            application.Status != CruiseApplicationStatus.WaitingForSupervisor
            && application.Status != CruiseApplicationStatus.AcceptedBySupervisor
            && application.Status != CruiseApplicationStatus.Accepted
        )
        {
            return ApplicationDecisionResult.DecisionWindowClosed;
        }

        if (application is { Status: CruiseApplicationStatus.Accepted, Cruise: not null })
        {
            return ApplicationDecisionResult.RemoveFromCruiseFirst;
        }

        application.Status = accept
            ? CruiseApplicationStatus.Accepted
            : CruiseApplicationStatus.Denied;

        return ApplicationDecisionResult.Applied;
    }
}

public enum ApplicationDecisionResult
{
    Applied,
    DecisionWindowClosed,
    RemoveFromCruiseFirst,
}
