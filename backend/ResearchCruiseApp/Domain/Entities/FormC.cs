using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormC : Entity
{
    [StringLength(1024)]
    public string ShipUsage { get; init; } = null!;
    
    public List<Permission> Permissions { get; init; } = [];
    
    public ResearchArea ResearchArea { get; set; } = null!;

    public List<FormCUgUnit> FormCUgUnits { get; init; } = [];
    
    public List<FormCGuestUnit> FormCGuestUnits { get; init; } = [];

    public List<ResearchTaskEffect> ResearchTaskEffects { get; init; } = [];

    public List<Contract> Contracts { get; init; } = [];

    public List<SpubTask> SpubTasks { get; init; } = [];

    public List<FormCShortResearchEquipment> FormCShortResearchEquipments { get; init; } = [];

    public List<FormCLongResearchEquipment> FormCLongResearchEquipments { get; init; } = [];

    public List<FormCPort> FormCPorts { get; init; } = [];

    public List<CruiseDayDetails> CruiseDaysDetails { get; init; } = [];

    public List<FormCResearchEquipment> FormCResearchEquipments { get; init; } = [];

    public List<ShipEquipment> ShipEquipments { get; init; } = [];

    public List<CollectedSample> CollectedSamples { get; init; } = [];

    [StringLength(1024)]
    public string? SpubReportData { get; init; }
    
    [StringLength(1024)]
    public string? AdditionalDescription { get; init; }

    public List<Photo> Photos { get; set; } = [];

    public CruiseApplication CruiseApplication { get; set; } = null!;
}