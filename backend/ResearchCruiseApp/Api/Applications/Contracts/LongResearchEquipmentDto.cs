using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Contracts;

public class LongResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string Action { get; init; } = null!;

    [StringLength(1024)]
    public string Duration { get; init; } = null!;
}
