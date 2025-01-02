using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class PermissionDto
{
    [StringLength(1024)]
    public string Description { get; init; } = null!;

    [StringLength(1024)]
    public string Executive { get; init; } = null!;

    public FileDto? Scan { get; set; }
}