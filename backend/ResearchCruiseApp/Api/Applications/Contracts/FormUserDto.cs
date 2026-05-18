using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ResearchCruiseApp.Api.Applications.Contracts;

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormUserDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
