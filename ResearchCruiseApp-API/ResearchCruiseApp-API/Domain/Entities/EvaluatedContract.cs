using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Domain.Entities;


public class EvaluatedContract
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
      
    public Contract Contract { get; set; } 
    public int CalculatedPoints { get; set; }
}