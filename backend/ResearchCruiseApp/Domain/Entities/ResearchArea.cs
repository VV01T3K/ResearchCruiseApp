using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchArea : Entity, IDictionaryEntity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }
}
