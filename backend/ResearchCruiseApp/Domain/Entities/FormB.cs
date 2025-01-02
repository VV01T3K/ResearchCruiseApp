using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormB : Entity
{
    [StringLength(1024)]
    public string IsCruiseManagerPresent { get; init; } = null!;

    public List<Permission> Permissions { get; init; } = [];

    public List<FormBUgUnit> FormBUgUnits { get; init; } = [];

    public List<FormBGuestUnit> FormBGuestUnits { get; init; } = [];
    
    public List<CrewMember> CrewMembers { get; init; } = [];

    public List<FormBShortResearchEquipment> FormBShortResearchEquipments { get; init; } = [];

    public List<FormBLongResearchEquipment> FormBLongResearchEquipments { get; init; } = [];

    public List<FormBPort> FormBPorts { get; init; } = [];

    public List<CruiseDayDetails> CruiseDaysDetails { get; init; } = [];
    
    public List<FormBResearchEquipment> FormBResearchEquipments { get; init; } = [];

    public List<ShipEquipment> ShipEquipments { get; init; } = [];
}