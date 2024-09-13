using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class UgUnit : Entity
{
    [StringLength(1024)]
    public string Name { get; set; } = null!;

    public bool IsActive { get; set; }

    public List<FormAUgUnit> FormAUgUnits { get; set; } = [];
}