using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormBFields
{
    [StringLength(1024)]
    public string IsCruiseManagerPresent { get; init; } = null!;

    public List<PermissionFields> Permissions { get; init; } = [];

    public List<UgTeamFields> UgTeams { get; init; } = [];

    public List<GuestTeamFields> GuestTeams { get; init; } = [];

    public List<CrewMemberFields> CrewMembers { get; init; } = [];

    public List<ShortTermResearchEquipmentFields> ShortResearchEquipments { get; init; } = [];

    public List<LongTermResearchEquipmentFields> LongResearchEquipments { get; init; } = [];

    public List<PortCallFields> Ports { get; init; } = [];

    public List<CruiseDayFields> CruiseDaysDetails { get; init; } = [];

    public List<ResearchEquipmentFields> ResearchEquipments { get; init; } = [];

    public List<Guid> ShipEquipmentsIds { get; init; } = [];
}

public class FormBOptions
{
    public List<ShipEquipmentOption> ShipEquipments { get; init; } = [];
}
