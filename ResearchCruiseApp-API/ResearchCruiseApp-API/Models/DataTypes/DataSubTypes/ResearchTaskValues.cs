namespace ResearchCruiseApp_API.Models.DataTypes.DataSubTypes;

public class ResearchTaskValues
{
    public string? Title { get; set; }
        
    public string? Author { get; set; }
        
    public string? Institution { get; set; }
        
    public string? Date { get; set; }
        
    public StringRange? Time { get; set; }
        
    public double? FinancingAmount { get; set; }
        
    public string? Description { get; set; }
}