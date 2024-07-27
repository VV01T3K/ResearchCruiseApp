using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Domain.Entities;


public class EvaluatedPublication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public Publication Publication { get; set; }
    public int CalculatedPoints { get; set; }
}