namespace ResearchCruiseApp.Api.Cruises.Contracts;

public class CruiseDto
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;

    public string StartDate { get; set; } = null!;

    public string EndDate { get; set; } = null!;

    public Guid MainCruiseManagerId { get; set; }

    public string MainCruiseManagerFirstName { get; set; } = null!;

    public string MainCruiseManagerLastName { get; set; } = null!;

    public Guid MainDeputyManagerId { get; set; }

    public string MainDeputyManagerFirstName { get; set; } = null!;

    public string MainDeputyManagerLastName { get; set; } = null!;

    public List<CruiseApplicationShortInfoDto> CruiseApplicationsShortInfo { get; set; } = [];

    public string Status { get; init; } = null!;

    public string? Title { get; set; }

    public bool ShipUnavailable { get; set; } = false;
}

public class CruiseApplicationShortInfoDto
{
    public Guid Id { get; set; }

    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }

    public string Number { get; set; } = null!;

    public string Points { get; set; } = null!;
}

public class CruiseBlockadePeriodDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Title { get; set; } = null!;
}
