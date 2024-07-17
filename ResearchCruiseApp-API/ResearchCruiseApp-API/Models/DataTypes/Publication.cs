namespace ResearchCruiseApp_API.Models.DataTypes;

public class Publication
{
    //Publikacje
    public string Category { get; set; } = null!;
    public int? Year { get; set; } = 0;
    public int? Points { get; set; } = 0;
    public string? DOI { get; set; }
    public string? Authors { get; set; }
    public string? Title { get; set; }
    public string? Magazine { get; set; }
}