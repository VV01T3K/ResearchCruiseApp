using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Data;

public class Application
{
    public enum ApplicationState
    {
        New,
        Accepted,
        Denied,
        Undertaken,
        Reported
    }
    
    
    [DatabaseGenerated((DatabaseGeneratedOption.Identity))]
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;

    public DateOnly Date { get; set; }
    
    public FormA? FormA { get; set; } = null!;
    
    public FormA? FormB { get; set; } = null!;
    
    public FormA? FormC { get; set; } = null!;
    
    public int Points { get; set; }
    
    public ApplicationState State { get; set; }
}