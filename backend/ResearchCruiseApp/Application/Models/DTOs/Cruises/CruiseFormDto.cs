namespace ResearchCruiseApp.Application.Models.DTOs.Cruises;

public class CruiseFormDto
{
    public string StartDate { get; set; } = null!;

    public string EndDate { get; set; } = null!;

    public CruiseManagersTeamDto ManagersTeam { get; set; }

    public List<Guid> CruiseApplicationsIds { get; set; } = [];

    public string? Title { get; set; }

    public bool ShipUnavailable { get; set; } = false;
}
