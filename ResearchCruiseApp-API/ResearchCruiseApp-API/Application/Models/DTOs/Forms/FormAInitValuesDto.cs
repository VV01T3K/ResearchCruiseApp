using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Forms;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class FormAInitValuesDto
{
    public List<FormUserDto> CruiseManagers { get; set; } = [];
    public List<FormUserDto> DeputyManagers { get; set; } = [];
    public List<string> Years { get; set; } = [];
    public List<string> ShipUsages { get; set; } = [];
    public List<ResearchAreaDto> ResearchAreas { get; set; } = [];
    public List<string> CruiseGoals { get; set; } = [];
    public List<ResearchTaskDto> HistoricalTasks { get; set; } = [];
    public List<UgUnitDto> UgUnits { get; set; } = [];
}