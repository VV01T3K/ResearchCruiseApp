using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class FormCDto
{
    [StringLength(1)]
    public string ShipUsage { get; init; } = null!;

    [StringLength(1024)]
    public string DifferentUsage { get; init; } = null!;

    public List<PermissionDto> Permissions { get; init; } = [];

    public List<ResearchAreaDescriptionDto> ResearchAreaDescriptions { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<ResearchTaskEffectDto> ResearchTasksEffects { get; init; } = [];

    public List<ContractDto> Contracts { get; init; } = [];

    public List<SpubTaskDto> SpubTasks { get; init; } = [];

    public List<ShortResearchEquipmentDto> ShortResearchEquipments { get; init; } = [];

    public List<LongResearchEquipmentDto> LongResearchEquipments { get; init; } = [];

    public List<PortDto> Ports { get; init; } = [];

    public List<CruiseDayDetailsDto> CruiseDaysDetails { get; init; } = [];

    public List<ResearchEquipmentDto> ResearchEquipments { get; init; } = [];

    public List<Guid> ShipEquipmentsIds { get; init; } = [];

    public List<CollectedSampleDto> CollectedSamples { get; init; } = [];

    [StringLength(10240)]
    public string? SpubReportData { get; init; } = null!;

    [StringLength(10240)]
    public string? AdditionalDescription { get; init; } = null!;

    public List<FileDto> Photos { get; init; } = []!;
}
