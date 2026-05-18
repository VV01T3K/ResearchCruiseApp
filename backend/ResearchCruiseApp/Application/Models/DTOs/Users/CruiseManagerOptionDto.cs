namespace ResearchCruiseApp.Application.Models.DTOs.Users;

public class CruiseManagerOptionDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
