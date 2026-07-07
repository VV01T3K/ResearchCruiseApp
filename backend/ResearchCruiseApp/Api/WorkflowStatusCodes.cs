using ResearchCruiseApp.Domain.Enums;

namespace ResearchCruiseApp.Api;

public static class WorkflowStatusCodes
{
    public static string ToCode(this CruiseStatus status)
    {
        return status switch
        {
            CruiseStatus.New => "new",
            CruiseStatus.Confirmed => "confirmed",
            CruiseStatus.Ended => "ended",
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null),
        };
    }

    public static string ToCode(this CruiseApplicationStatus status)
    {
        return status switch
        {
            CruiseApplicationStatus.Draft => "draft",
            CruiseApplicationStatus.WaitingForSupervisor => "waitingForSupervisor",
            CruiseApplicationStatus.AcceptedBySupervisor => "acceptedBySupervisor",
            CruiseApplicationStatus.DeniedBySupervisor => "deniedBySupervisor",
            CruiseApplicationStatus.Accepted => "accepted",
            CruiseApplicationStatus.Denied => "denied",
            CruiseApplicationStatus.FormBRequired => "formBRequired",
            CruiseApplicationStatus.FormBFilled => "formBFilled",
            CruiseApplicationStatus.Undertaken => "undertaken",
            CruiseApplicationStatus.Reported => "reported",
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null),
        };
    }
}
