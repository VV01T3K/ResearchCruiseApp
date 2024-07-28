namespace ResearchCruiseApp_API.Application.UseCaseServices.Cruises.DTOs.Properties;


public struct CruiseManagersTeamDto
{
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }
}