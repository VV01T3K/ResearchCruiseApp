using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PermissionDto
{
    [StringLength(1024)]
    public string Description { get; set; } = null!;

    [StringLength(1024)]
    public string Executive { get; set; } = null!;

    public FileDto? Scan { get; set; }
}