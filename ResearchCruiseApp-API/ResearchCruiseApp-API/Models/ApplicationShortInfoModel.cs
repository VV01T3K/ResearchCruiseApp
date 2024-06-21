using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models;

public class ApplicationShortInfoModel
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;
    
    public int Points { get; set; }
}   