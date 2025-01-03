using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class FormADto
{
    public Guid? Id { get; init; }

    public Guid CruiseManagerId { get; init; }

    public Guid? DeputyManagerId { get; init; }

    [StringLength(4)]
    public string Year { get; init; } = null!;

    [Length(2, 2)]
    public HashSet<string> AcceptablePeriod { get; init; } = [];

    [Length(2, 2)]
    public HashSet<string> OptimalPeriod { get; init; } = [];

    [StringLength(8)]
    public string CruiseHours { get; init; } = null!;

    [StringLength(1024)]
    public string PeriodNotes { get; init; } = null!;

    [StringLength(1)]
    public string? ShipUsage { get; init; }

    [StringLength(1024)]
    public string DifferentUsage { get; init; } = null!;

    public List<PermissionDto> Permissions { get; init; } = [];

    public Guid? ResearchAreaId { get; init; }

    [StringLength(1024)]
    public string? ResearchAreaInfo { get; init; }

    public string? CruiseGoal { get; init; }

    [StringLength(1024)]
    public string CruiseGoalDescription { get; init; } = null!;

    public List<ResearchTaskDto> ResearchTasks { get; init; } = [];

    public List<ContractDto> Contracts { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<PublicationDto> Publications { get; init; } = [];

    public List<SpubTaskDto> SpubTasks { get; init; } = [];

    [StringLength(1024)]
    public string SupervisorEmail { get; init; } = null!;

    [StringLength(1024)]
    public string? Note { get; set; }
}
