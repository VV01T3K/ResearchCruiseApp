using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public abstract class Entity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
}