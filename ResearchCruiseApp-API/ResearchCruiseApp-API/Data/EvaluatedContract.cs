using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedContract
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
      
    public Contract Contract { get; set; } 
    public int CalculatedPoints { get; set; }
    
    public EvaluatedContract()
    {
        
    }
}