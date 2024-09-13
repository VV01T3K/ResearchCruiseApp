using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseApplication : Entity, IYearBasedNumbered
{
    [StringLength(1024)]
    public string Number { get; set; } = null!;
    
    public DateOnly Date { get; set; }
    
    public FormA? FormA { get; set; }
    
    public FormB? FormB { get; set; }
    
    public FormC? FormC { get; set; }
    
    public CruiseApplicationStatus Status { get; set; }

    public byte[] SupervisorCode { get; set; } = [];
}