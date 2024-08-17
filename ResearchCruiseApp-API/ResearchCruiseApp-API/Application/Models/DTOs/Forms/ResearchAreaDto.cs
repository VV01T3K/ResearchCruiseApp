using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Forms;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class ResearchAreaDto(string name, List<int> x, List<int> y)
{
    public string Name { get; set; } = name;
    public List<int> X { get; set; } = x;
    public List<int> Y { get; set; } = y;
}