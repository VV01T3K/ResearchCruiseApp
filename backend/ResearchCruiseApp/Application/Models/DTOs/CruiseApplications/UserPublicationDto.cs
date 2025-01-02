namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class UserPublicationDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }
    
    public PublicationDto Publication { get; init; } = null!;
}