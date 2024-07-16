using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;

public class PeriodData
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public DateTime BegDate{ get; set; }
    
    public DateTime EndDate { get; set; }
    
    public string Data { get; set; }
}