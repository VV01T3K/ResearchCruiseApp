namespace ResearchCruiseApp_API.Models.DataTypes;

public class Thesis
{
    //Prace
    public string Category { get; set; } = null!;
    
    public int? Year { get; set; } = 0;
    
    public string Author { get; set; }
    
    public string Title { get; set; }
    
    public string? Promoter { get; set; }
    
}