using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FileDto
{
    [StringLength(1024)]
    public string Name { get; set; } = null!;
    
    public string Content { get; set; } = null!;
}