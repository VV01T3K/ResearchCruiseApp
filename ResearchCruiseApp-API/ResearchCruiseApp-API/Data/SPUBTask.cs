namespace ResearchCruiseApp_API.Data;

public class SPUBTask
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int YearFrom { get; set; }
    public int YearTo { get; set; }
    public List<FormA> Forms { get; set; } = null!;
}