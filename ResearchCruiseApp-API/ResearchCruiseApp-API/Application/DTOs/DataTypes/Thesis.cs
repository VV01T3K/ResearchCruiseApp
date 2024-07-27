namespace ResearchCruiseApp_API.Application.DTOs.DataTypes;


public class Thesis
{
    public string Category { get; set; } = null!;

    public string Author { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Promoter { get; set; } = null!;
    
    public int Year { get; set; }
}