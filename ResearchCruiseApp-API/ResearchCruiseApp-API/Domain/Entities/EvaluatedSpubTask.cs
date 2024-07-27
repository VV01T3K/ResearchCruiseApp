using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Domain.Entities;


public class EvaluatedSpubTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public SpubTask SpubTask { get; set; }
    public int CalculatedPoints { get; set; }
}