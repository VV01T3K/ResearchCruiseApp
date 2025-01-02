using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class Cruise : Entity, IYearBasedNumbered
{
    [StringLength(1024)]
    public string Number { get; set; } = null!;
    
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }

    [StringLength(64)]
    public string StartDate { get; set; } = null!;

    [StringLength(64)]
    public string EndDate { get; set; } = null!;
    
    public CruiseStatus Status { get; set; }

    public List<CruiseApplication> CruiseApplications { get; set; } = null!;
}