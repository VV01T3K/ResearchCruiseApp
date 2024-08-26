using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Entities;

namespace  ResearchCruiseApp_API.Temp.Entities;


public class EvaluatedSpubTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public SpubTask SpubTask { get; set; }
    public int CalculatedPoints { get; set; }
}