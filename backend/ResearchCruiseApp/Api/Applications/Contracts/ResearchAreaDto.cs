using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ResearchCruiseApp.Api.Applications.Contracts;

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class ResearchAreaDto(Guid id, string name)
{
    public Guid Id { get; set; } = id;

    public string Name { get; set; } = name;
}
