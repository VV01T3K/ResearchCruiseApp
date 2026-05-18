namespace ResearchCruiseApp.Api.Cruises.Contracts;

public class CruiseBlockadePeriodDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Title { get; set; } = null!;
}
