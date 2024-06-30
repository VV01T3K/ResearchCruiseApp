using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedContract
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
      
    //[Range(0, 1)]
    public string Category { get; set; }
      
    [MaxLength(50)]
    public string InstitutionName { get; set; }
      
    [MaxLength(200)]
    public string Description { get; set; }
  
    [MaxLength(50)]
    public string InstitutionLocation { get; set; }

    [MaxLength(50)] 
    public string InstitutionUnit { get; set; }

    //public string File { get; set; }
    public int CalculatedPoints { get; set; }
    
    EvaluatedContract()
    {
        
    }
}