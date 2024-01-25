using NuGet.Protocol.Plugins;

namespace ResearchCruiseApp_API.Data;

public class Publication
{
    public int Id { get; set; }
    public string Cathegory { get; set; } = null!;
    public int DOI { get; set; }
    public string Authors { get; set; } = null!;
    public int Release_year { get; set; }
    public string Title { get; set; } = null!;
    public string Magazine { get; set; } = null!;
    public int Points { get; set; }
    public List<FormA> FormsA { get; set; } = null!;
}