namespace ResearchCruiseApp_API.Domain.Entities;

public class UserPublication : Entity
{
    public Guid UserId { get; set; }

    public Publication Publication { get; set; } = null!;
}