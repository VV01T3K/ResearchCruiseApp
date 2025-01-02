using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class PortDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}