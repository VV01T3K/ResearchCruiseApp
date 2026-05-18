using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Applications.Contracts;

public class UgTeamDto
{
    public Guid UgUnitId { get; init; }

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}
