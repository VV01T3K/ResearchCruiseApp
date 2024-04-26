using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Data;

public class LogicalCruise
{
    public enum LogicalCruiseState
    {
        Planned,
        Accepted,
        Denied,
        Undertaken,
        Reported
    }
    
    
    [DatabaseGenerated((DatabaseGeneratedOption.Identity))]
    public Guid Id { get; set; }
    
    public int Points { get; set; }
    
    public LogicalCruiseState State { get; set; }
    
    public string? FormA { get; set; } = null!;
    
    public string? FormB { get; set; } = null!;
    
    public string? FormC { get; set; } = null!;
}