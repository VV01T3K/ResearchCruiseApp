using ResearchCruiseApp.Domain.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ShipEquipment : Entity
{
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }

    public List<FormB> FormsB { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];
}
