using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Entities;

namespace  ResearchCruiseApp_API.Temp.Entities;


public class EvaluatedPublication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public Publication Publication { get; set; }
    public int CalculatedPoints { get; set; }
}