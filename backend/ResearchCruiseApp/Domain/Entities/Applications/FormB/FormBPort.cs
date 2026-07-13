namespace ResearchCruiseApp.Domain.Entities;

public class FormBPort : Entity
{
    public FormB FormB { get; init; } = null!;

    public Port Port { get; set; } = null!;
    public string StartTime { get; init; } = null!;
    public string EndTime { get; init; } = null!;
}
