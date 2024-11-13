using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class ShipEquipment : Entity, IDictionaryEntity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    public bool IsActive { get; set; }


    public List<FormB> FormsB { get; init; } = [];
    
    public List<FormC> FormsC { get; init; } = [];
}