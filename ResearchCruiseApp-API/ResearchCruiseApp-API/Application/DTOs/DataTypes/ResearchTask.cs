using ResearchCruiseApp_API.Application.DTOs.DataTypes.DataSubTypes;

namespace ResearchCruiseApp_API.Application.DTOs.DataTypes;


public class ResearchTask
{
    public int Type { get; set; }

    public ResearchTaskValues Values { get; set; } = null!;
}