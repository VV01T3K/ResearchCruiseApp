using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Permission : Entity
{
    [StringLength(1024)]
    public string Description { get; set; } = null!;

    [StringLength(1024)]
    public string Executive { get; set; } = null!;

    [StringLength(1024)]
    public string ScanName { get; set; } = null!;
    
    [StringLength(1024)]
    public byte[] ScanContent { get; set; } = [];
}