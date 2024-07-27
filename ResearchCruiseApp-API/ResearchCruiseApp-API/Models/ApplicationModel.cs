using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models;

public class ApplicationModel
{
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;
    
    public DateOnly Date { get; set; }
    
    public int Year { get; set; }
    
    public Guid CruiseManagerId { get; set; }
    
    public string? CruiseManagerEmail { get; set; } = null!;
    
    public string CruiseManagerFirstName { get; set; } = null!;
    
    public string CruiseManagerLastName { get; set; } = null!;
    
    public Guid DeputyManagerId { get; set; }
    
    public string? DeputyManagerEmail { get; set; } = null!;
    
    public string DeputyManagerFirstName { get; set; } = null!;
    
    public string DeputyManagerLastName { get; set; } = null!;
    
    public bool HasFormA { get; set; }
    
    public bool HasFormB{ get; set; }
    
    public bool HasFormC { get; set; }
    
    public int Points { get; set; }
    
    public string Status { get; set; }
    
    public string? PointsDetails { get; set; }
}   