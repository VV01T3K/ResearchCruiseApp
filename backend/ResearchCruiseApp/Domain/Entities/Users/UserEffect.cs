using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class UserEffect : Entity
{
    public Guid UserId { get; init; }

    public ResearchTaskEffect Effect { get; init; } = null!;

    public int Points { get; set; }
}
