using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;

public class FormBShortResearchEquipment : Entity
{
    public FormB FormB { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    [StringLength(1024)]
    public string StartDate { get; init; } = null!;

    [StringLength(1024)]
    public string EndDate { get; init; } = null!;
}
