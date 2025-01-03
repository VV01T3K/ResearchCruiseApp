namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class UserEffectDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public ResearchTaskEffectDto Effect { get; init; } = null!;

    public string Points { get; init; } = "0";

    public string CruiseApplicationId { get; init; } = null!;
}
