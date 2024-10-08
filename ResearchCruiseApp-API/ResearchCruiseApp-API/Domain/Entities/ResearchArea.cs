using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class ResearchArea : Entity, IDbDictionary
{
    [StringLength(1024)] 
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }
    
    public List<FormA> FormsA { get; init; } = [];

    public List<FormB> FormsB { get; init; } = [];
}