namespace ResearchCruiseApp.Domain.Entities;

public class FormAResearchAreaFile : Entity
{
    public string FileName { get; init; } = null!;

    public byte[] FileContent { get; init; } = [];

    public Guid FormAId { get; init; }

    public FormA? FormA { get; init; }
}
