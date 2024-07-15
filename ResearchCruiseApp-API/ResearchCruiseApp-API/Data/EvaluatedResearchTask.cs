using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedResearchTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public ResearchTask ResearchTask { get; set; }
    public int CalculatedPoints { get; set; }

    public EvaluatedResearchTask()
    {
        
    }
}