using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public record ResearchAreaDescriptionDto
{
    public Guid? AreaId { get; init; }

    [StringLength(1024)]
    public string? DifferentName { get; init; }

    [StringLength(10240)]
    public string Info { get; init; } = "";
}
