using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormBFields
{
    [StringLength(1024)]
    public required string IsCruiseManagerPresent { get; init; }

    public required List<PermissionFields> Permissions { get; init; }

    public required List<UgTeamFields> UgTeams { get; init; }

    public required List<GuestTeamFields> GuestTeams { get; init; }

    public required List<CrewMemberFields> CrewMembers { get; init; }

    public required List<ShortTermResearchEquipmentFields> ShortResearchEquipments { get; init; }

    public required List<LongTermResearchEquipmentFields> LongResearchEquipments { get; init; }

    public required List<PortCallFields> Ports { get; init; }

    public required List<CruiseDayFields> CruiseDaysDetails { get; init; }

    public required List<ResearchEquipmentFields> ResearchEquipments { get; init; }

    public required List<Guid> ShipEquipmentsIds { get; init; }
}

public class FormBOptions
{
    public List<ShipEquipmentOption> ShipEquipments { get; init; } = [];
}
