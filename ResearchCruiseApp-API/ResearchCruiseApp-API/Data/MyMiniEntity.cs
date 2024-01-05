namespace ResearchCruiseApp_API.Data;

public class MyMiniEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public List<MyEntity> MyEntities { get; set; } = null!;
}