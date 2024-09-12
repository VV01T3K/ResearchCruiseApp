namespace ResearchCruiseApp_API.Domain.Entities;


public class FormAGuestUnit : Entity
{
    public FormA FormA { get; init; } = null!;

    public GuestUnit GuestUnit { get; init; } = null!;
    
    public int NoOfPersons { get; init; }
}