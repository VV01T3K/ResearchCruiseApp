using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class UgUnit : Entity, IDictionaryEntity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];

    public List<FormBUgUnit> FormBUgUnits { get; init; } = [];
    
    public List<FormCUgUnit> FormCUgUnits { get; init; } = [];
}