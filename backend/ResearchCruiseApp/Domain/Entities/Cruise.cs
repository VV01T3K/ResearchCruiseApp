using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class Cruise : Entity, IYearBasedNumbered
{
    public string Number { get; set; } = null!;

    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }
    public string StartDate { get; set; } = null!;
    public string EndDate { get; set; } = null!;

    public CruiseStatus Status { get; set; }
    public string? Title { get; set; }

    public bool ShipUnavailable { get; set; } = false;

    public List<CruiseApplication> CruiseApplications { get; set; } = null!;
}
