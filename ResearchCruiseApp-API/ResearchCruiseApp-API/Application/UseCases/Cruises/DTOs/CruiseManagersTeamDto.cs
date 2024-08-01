namespace ResearchCruiseApp_API.Application.UseCases.Cruises.DTOs;


public struct CruiseManagersTeamDto
{
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }
}