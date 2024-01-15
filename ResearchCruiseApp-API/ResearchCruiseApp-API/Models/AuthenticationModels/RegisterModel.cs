namespace ResearchCruiseApp_API.Models.AuthenticationModels;

public class RegisterModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public string? Role { get; init; }
}