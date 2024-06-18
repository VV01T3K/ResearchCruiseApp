using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Data.Interfaces;

namespace ResearchCruiseApp_API.Data;

public class Cruise : IYearBasedNumberedEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;
    
    public Guid MainCruiseManagerId { get; set; }

    public Guid MainDeputyManagerId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public List<Application> Applications { get; set; } = null!;
}