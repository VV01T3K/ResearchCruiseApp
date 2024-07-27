namespace ResearchCruiseApp_API.Application.DTOs;


public class ApplicationShortInfoModel
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;
    
    public int Points { get; set; }
}   