using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class ResearchArea : Entity
{
    [StringLength(1024)] 
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }
    
    public List<FormA> FormsA { get; init; } = [];
}