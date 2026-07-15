using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormCFields
{
    [StringLength(1)]
    public string ShipUsage { get; init; } = null!;

    [StringLength(1024)]
    public string DifferentUsage { get; init; } = null!;

    public List<PermissionFields> Permissions { get; init; } = [];

    public List<ResearchAreaSelection> ResearchAreaDescriptions { get; init; } = [];

    public List<UgTeamFields> UgTeams { get; init; } = [];

    public List<GuestTeamFields> GuestTeams { get; init; } = [];

    public List<ResearchTaskEffectFields> ResearchTasksEffects { get; init; } = [];

    public List<ContractFields> Contracts { get; init; } = [];

    public List<SpubTaskFields> SpubTasks { get; init; } = [];

    public List<ShortTermResearchEquipmentFields> ShortResearchEquipments { get; init; } = [];

    public List<LongTermResearchEquipmentFields> LongResearchEquipments { get; init; } = [];

    public List<PortCallFields> Ports { get; init; } = [];

    public List<CruiseDayFields> CruiseDaysDetails { get; init; } = [];

    public List<ResearchEquipmentFields> ResearchEquipments { get; init; } = [];

    public List<Guid> ShipEquipmentsIds { get; init; } = [];

    public List<CollectedSampleFields> CollectedSamples { get; init; } = [];

    [StringLength(10240)]
    public string? SpubReportData { get; init; } = null!;

    [StringLength(10240)]
    public string? AdditionalDescription { get; init; } = null!;

    public List<FileContent> Photos { get; init; } = []!;
}
