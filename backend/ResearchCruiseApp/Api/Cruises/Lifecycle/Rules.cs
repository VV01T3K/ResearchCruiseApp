using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseLifecycleRules
{
    public static CruiseLifecycleResult Complete(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
            return CruiseLifecycleResult.NotConfirmed;
        if (cruise.Status != CruiseStatus.Confirmed)
            return CruiseLifecycleResult.NotCompletable;

        cruise.Status = CruiseStatus.Ended;
        foreach (var application in cruise.CruiseApplications)
        {
            if (application.Status == CruiseApplicationStatus.FormBFilled)
                application.Status = CruiseApplicationStatus.Undertaken;
        }

        return CruiseLifecycleResult.Applied;
    }

    public static CruiseLifecycleResult Revert(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
            return CruiseLifecycleResult.AlreadyNew;

        foreach (var application in cruise.CruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.FormBRequired
            )
            {
                application.Status = CruiseApplicationStatus.Accepted;
            }

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.Undertaken
            )
            {
                application.Status = CruiseApplicationStatus.FormBFilled;
            }
        }

        cruise.Status = cruise.Status switch
        {
            CruiseStatus.Confirmed => CruiseStatus.New,
            CruiseStatus.Ended => CruiseStatus.Confirmed,
            _ => cruise.Status,
        };

        return CruiseLifecycleResult.Applied;
    }
}

public enum CruiseLifecycleResult
{
    Applied,
    AlreadyNew,
    NotConfirmed,
    NotCompletable,
}
