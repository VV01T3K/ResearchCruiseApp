using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Cruise : Entity, IYearBasedNumbered
{
    [StringLength(1024)]
    public string Number { get; set; } = null!;
    
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }
    
    public DateTime StartDate { get; set; }
    
    public DateTime EndDate { get; set; }
    
    public CruiseStatus Status { get; set; }

    public List<CruiseApplication> CruiseApplications { get; set; } = null!;
}