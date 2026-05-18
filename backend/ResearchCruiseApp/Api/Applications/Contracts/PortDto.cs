using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Contracts;

public class PortDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}
