namespace ResearchCruiseApp.Domain;

public enum CruiseApplicationStatus
{
    Draft,

    WaitingForSupervisor,

    AcceptedBySupervisor,

    DeniedBySupervisor,

    Accepted,

    Denied,

    FormBRequired,

    FormBFilled,

    Undertaken,

    Reported,
}
