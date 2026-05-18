using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Contracts;

public class FileDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public string Content { get; init; } = null!;
}
