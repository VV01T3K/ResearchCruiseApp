using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data;
public class EvaluatedPublication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Category { get; set; }
    
    public int Year { get; set; }
    
    public int Points { get; set; }
    
    //Info_type
    public int DOI { get; set; }
    
    public string Authors { get; set; }
    
    public string Title { get; set; }
    
    public string Magazine { get; set; }
    public int CalculatedPoints { get; set; }
    EvaluatedPublication()
    {
        
    }
}