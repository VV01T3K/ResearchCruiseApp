using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseLifecycleRules
{
    // Only accepted applications are asked for Form B; a submitted one is kept.
    public static List<CruiseApplication> RequestFormB(IEnumerable<CruiseApplication> applications)
    {
        var requested = applications
            .Where(application => application.Status == CruiseApplicationStatus.Accepted)
            .ToList();
        foreach (var application in requested)
            application.Status = CruiseApplicationStatus.FormBRequired;

        return requested;
    }

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

        // A submitted Form C has awarded effect points, which an earlier status cannot hold.
        if (
            cruise.CruiseApplications.Any(application =>
                application.Status == CruiseApplicationStatus.Reported
            )
        )
        {
            return CruiseLifecycleResult.HasReportedApplications;
        }

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
    HasReportedApplications,
}
