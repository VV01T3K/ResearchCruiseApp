namespace ResearchCruiseApp_API.Models.DataTypes;

public class Publication
{
    public string Category { get; set; } = null!;

    public string DOI { get; set; } = null!;

    public string Authors { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Magazine { get; set; } = null!;
    
    public int Year { get; set; }
    
    public int MinisterialPoints { get; set; }
}