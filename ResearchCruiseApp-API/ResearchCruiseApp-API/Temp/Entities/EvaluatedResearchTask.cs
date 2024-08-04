using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Entities;

namespace  ResearchCruiseApp_API.Temp.Entities;


public class EvaluatedResearchTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public ResearchTask ResearchTask { get; set; }
    public int CalculatedPoints { get; set; }
}