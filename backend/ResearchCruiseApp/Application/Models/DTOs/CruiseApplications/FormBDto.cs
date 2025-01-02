using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class FormBDto
{
    [StringLength(1024)]
    public string IsCruiseManagerPresent { get; init; } = null!;

    public List<PermissionDto> Permissions { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<CrewMemberDto> CrewMembers { get; init; } = [];

    public List<ShortResearchEquipmentDto> ShortResearchEquipments { get; init; } = [];

    public List<LongResearchEquipmentDto> LongResearchEquipments { get; init; } = [];

    public List<PortDto> Ports { get; init; } = [];

    public List<CruiseDayDetailsDto> CruiseDaysDetails { get; init; } = [];

    public List<ResearchEquipmentDto> ResearchEquipments { get; init; } = [];

    public List<Guid> ShipEquipmentsIds { get; init; } = [];
}