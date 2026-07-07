namespace ResearchCruiseApp.Domain.Entities;

public class FormCPort : Entity
{
    public FormC FormC { get; init; } = null!;

    public Port Port { get; init; } = null!;
    public string StartTime { get; init; } = null!;
    public string EndTime { get; init; } = null!;
}
