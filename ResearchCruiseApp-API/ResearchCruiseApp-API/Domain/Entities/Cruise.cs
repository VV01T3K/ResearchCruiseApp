using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Domain.Common.Interfaces;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Cruise : IYearBasedNumberedEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    [StringLength(1024)]
    public string Number { get; set; } = null!;

    public User? MainCruiseManager { get; set; } = null!;

    public User? MainDeputyManager { get; set; } = null!;
    
    public DateTime StartDate { get; set; }
    
    public DateTime EndDate { get; set; }

    public List<CruiseApplication> CruiseApplications { get; set; } = null!;
}