using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models;

public class ApplicationModel
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;

    public DateOnly Date { get; set; }
    
    public int Year { get; set; }

    public string CruiseManagerFirstName { get; set; } = null!;

    public string CruiseManagerLastName { get; set; } = null!;
    
    public string DeputyManagerFirstName { get; set; } = null!;

    public string DeputyManagerLastName { get; set; } = null!;
    
    public Guid? FormAId { get; set; } = null!;
    
    public Guid? FormBId { get; set; } = null!;
    
    public Guid? FormCId { get; set; } = null!;
    
    public int Points { get; set; }

    public string Status { get; set; }

    public string? PointsDetails { get; set; }
}   