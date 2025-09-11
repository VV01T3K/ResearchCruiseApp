using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class CollectedSampleDto
{
    [StringLength(10240)]
    public string Type { get; init; } = null!;

    [StringLength(10240)]
    public string Amount { get; init; } = null!;

    [StringLength(10240)]
    public string Analysis { get; init; } = null!;

    [StringLength(10240)]
    public string Publishing { get; init; } = null!;
}
