using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class PermissionDto
{
    [StringLength(1024)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? Executive { get; init; }

    public FileDto? Scan { get; set; }
}
