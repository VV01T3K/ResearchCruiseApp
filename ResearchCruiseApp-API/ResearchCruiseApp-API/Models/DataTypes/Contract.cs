using ResearchCruiseApp_API.Models.DataTypes.DataSubTypes;

namespace ResearchCruiseApp_API.Models.DataTypes;

public class Contract
{
    public string Category { get; set; } = null!;

    public Institution Institution { get; set; } = null!;

    public string Description { get; set; } = null!;

    public Scan Scan { get; set; } = null!;
}