using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedResearchTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public int Type { get; set; }

    public string? Title { get; set; }
    public string? Author { get; set; }
    public string? Institution { get; set; }
    //zmienić w frontendzie na DATETIME
    public string? Date { get; set; }
    
    //Time_type
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    
    //zmienić w frontendzie na int
    public string? FinancingAmount { get; set; }
    public string? Description { get; set; }
    public int CalculatedPoints { get; set; }

    EvaluatedResearchTask()
    {
        
    }
}