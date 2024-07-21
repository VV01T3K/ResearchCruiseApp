using System.Text.Json.Serialization;
using ResearchCruiseApp_API.Models.DataTypes.DataSubTypes;

namespace ResearchCruiseApp_API.Models.DataTypes;

public class ResearchTask
{
    public int Type { get; set; }
    
    public ResearchTaskValues Values { get; set; } 
}