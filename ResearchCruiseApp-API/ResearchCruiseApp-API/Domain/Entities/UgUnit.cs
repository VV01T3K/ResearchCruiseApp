using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class UgUnit : Entity, IDbDictionary
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];

    public List<FormBUgUnit> FormBUgUnits { get; init; } = [];
    
    public List<FormCUgUnit> FormCUgUnits { get; init; } = [];
}