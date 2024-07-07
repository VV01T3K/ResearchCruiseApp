using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedSPUBTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string YearFrom { get; set; }
    
    public string YearTo { get; set; }

    public int CalculatedPoints { get; set; }
    
    EvaluatedSPUBTask()
    {
        
    }
}