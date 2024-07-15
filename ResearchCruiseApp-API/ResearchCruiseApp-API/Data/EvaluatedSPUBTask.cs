using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedSPUBTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public SPUBTask SpubTask { get; set; }
    public int CalculatedPoints { get; set; }
    
    public EvaluatedSPUBTask()
    {
        
    }
}