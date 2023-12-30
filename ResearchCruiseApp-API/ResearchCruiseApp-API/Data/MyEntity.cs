using NuGet.Protocol.Plugins;

namespace ResearchCruiseApp_API.Data;

public class MyEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public List<MyMiniEntity> MiniEntities { get; set; } = null!;
}