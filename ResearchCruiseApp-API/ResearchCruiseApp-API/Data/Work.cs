namespace ResearchCruiseApp_API.Data;

public class Work
{
    public int Id { get; set; }
    public string Cathegory { get; set; } = null!;
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Promotor { get; set; } = null!;
    public int Year_of_defence { get; set; }
    public List<FormA> FormsA { get; set; } = null!;
}