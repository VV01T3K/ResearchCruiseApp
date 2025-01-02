namespace ResearchCruiseApp.Application.Models.DTOs.Cruises;


public struct CruiseManagersTeamDto
{
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }
}