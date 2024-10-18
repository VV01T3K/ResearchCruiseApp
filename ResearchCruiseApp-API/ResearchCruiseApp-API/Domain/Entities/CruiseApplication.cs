using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseApplication : Entity
{
    public int Number { get; set; }
    
    public DateOnly Date { get; init; }
    
    public FormA? FormA { get; init; }
    
    public FormB? FormB { get; set; }
    
    public FormC? FormC { get; set; }
    
    public CruiseApplicationStatus Status { get; set; }
    
    public byte[] SupervisorCode { get; init; } = [];

    public int EffectsPoints { get; set; }
}