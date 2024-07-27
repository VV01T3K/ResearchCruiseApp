using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Application : IYearBasedNumberedEntity
{
    [DatabaseGenerated((DatabaseGeneratedOption.Identity))]
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;

    public DateOnly Date { get; set; }
    
    public FormA? FormA { get; set; } = null!;
    
    public FormB? FormB { get; set; } = null!;
    
    public FormC? FormC { get; set; } = null!;

    public EvaluatedApplication? EvaluatedApplication { get; set; } = null!;
    
    public int Points { get; set; }
    
    public ApplicationStatus Status { get; set; }
}