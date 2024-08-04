using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Entities;

namespace  ResearchCruiseApp_API.Temp.Entities;


public class EvaluatedContract
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
      
    public Contract Contract { get; set; } 
    public int CalculatedPoints { get; set; }
}