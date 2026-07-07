namespace ResearchCruiseApp.Domain.Entities;

public class ResearchTaskEffect : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchTask ResearchTask { get; init; } = null!;
    public string Done { get; init; } = null!;
    public string? PublicationMinisterialPoints { get; init; }
    public string ManagerConditionMet { get; init; } = null!;
    public string DeputyConditionMet { get; init; } = null!;

    public List<UserEffect> UserEffects { get; set; } = [];
}
