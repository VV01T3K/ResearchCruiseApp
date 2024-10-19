namespace ResearchCruiseApp_API.Domain.Entities;


public class UserEffect : Entity
{
    public Guid UserId { get; set; }

    public ResearchTaskEffect Effect { get; set; } = null!;

    public int Points { get; set; }
}