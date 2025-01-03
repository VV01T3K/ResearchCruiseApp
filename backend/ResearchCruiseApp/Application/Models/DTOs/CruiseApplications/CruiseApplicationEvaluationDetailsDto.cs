namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class CruiseApplicationEvaluationDetailsDto
{
    public List<FormAResearchTaskDto> FormAResearchTasks { get; init; } = [];

    public List<FormAContractDto> FormAContracts { get; init; } = [];

    public List<UgTeamWithNameDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public string UgUnitsPoints { get; init; } = null!;

    public List<FormAPublicationDto> FormAPublications { get; init; } = [];

    public List<FormASpubTaskDto> FormASpubTasks { get; init; } = [];

    public string EffectsPoints { get; init; } = null!;
}
