using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormCFields
{
    [StringLength(1)]
    public required string ShipUsage { get; init; }

    [StringLength(1024)]
    public required string DifferentUsage { get; init; }

    public required List<PermissionFields> Permissions { get; init; }

    public required List<ResearchAreaSelection> ResearchAreaDescriptions { get; init; }

    public required List<UgTeamFields> UgTeams { get; init; }

    public required List<GuestTeamFields> GuestTeams { get; init; }

    public required List<ResearchTaskEffectFields> ResearchTasksEffects { get; init; }

    public required List<ContractFields> Contracts { get; init; }

    public required List<SpubTaskFields> SpubTasks { get; init; }

    public required List<ShortTermResearchEquipmentFields> ShortResearchEquipments { get; init; }

    public required List<LongTermResearchEquipmentFields> LongResearchEquipments { get; init; }

    public required List<PortCallFields> Ports { get; init; }

    public required List<CruiseDayFields> CruiseDaysDetails { get; init; }

    public required List<ResearchEquipmentFields> ResearchEquipments { get; init; }

    public required List<Guid> ShipEquipmentsIds { get; init; }

    public required List<CollectedSampleFields> CollectedSamples { get; init; }

    [StringLength(10240)]
    public required string? SpubReportData { get; init; }

    [StringLength(10240)]
    public required string? AdditionalDescription { get; init; }

    public required List<FileContent> Photos { get; init; }
}
