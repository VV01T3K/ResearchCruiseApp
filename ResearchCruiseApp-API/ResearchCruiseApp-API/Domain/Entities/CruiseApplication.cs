using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseApplication : IYearBasedNumberedEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;
    
    public DateOnly Date { get; set; }
    
    public FormA? FormA { get; set; }
    
    public FormB? FormB { get; set; }
    
    public FormC? FormC { get; set; }
    
    //public EvaluatedCruiseApplication? EvaluatedApplication { get; set; }
    
    public int Points { get; set; }
    
    public CruiseApplicationStatus Status { get; set; }
}