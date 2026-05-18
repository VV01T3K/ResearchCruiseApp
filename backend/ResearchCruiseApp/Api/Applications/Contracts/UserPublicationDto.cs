namespace ResearchCruiseApp.Api.Applications.Contracts;

public class UserPublicationDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public PublicationDto Publication { get; init; } = null!;
}
