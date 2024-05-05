namespace ResearchCruiseApp_API.Models.Users;

public class ResearchAreaModel(string Name, List<int> X, List<int> Y)
{
    public string Name { get; set; } = Name;
    public List<int> X { get; set; } = X;
    public List<int> Y { get; set; } = Y;
}