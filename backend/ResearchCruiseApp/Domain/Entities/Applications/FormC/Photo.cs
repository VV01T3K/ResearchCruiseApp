namespace ResearchCruiseApp.Domain.Entities;

public class Photo : Entity
{
    public string Name { get; set; } = null!;

    public byte[] Content { get; set; } = [];
}
