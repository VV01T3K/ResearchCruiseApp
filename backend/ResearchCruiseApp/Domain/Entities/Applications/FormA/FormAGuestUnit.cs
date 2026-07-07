namespace ResearchCruiseApp.Domain.Entities;

public class FormAGuestUnit : Entity
{
    public FormA FormA { get; init; } = null!;

    public GuestUnit GuestUnit { get; init; } = null!;
    public string NoOfPersons { get; init; } = null!;
}
