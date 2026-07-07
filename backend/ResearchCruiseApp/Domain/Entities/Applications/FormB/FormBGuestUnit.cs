namespace ResearchCruiseApp.Domain.Entities;

public class FormBGuestUnit : Entity
{
    public FormB FormB { get; init; } = null!;

    public GuestUnit GuestUnit { get; init; } = null!;
    public string NoOfPersons { get; init; } = null!;
}
