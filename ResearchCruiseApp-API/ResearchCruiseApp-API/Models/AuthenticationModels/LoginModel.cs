namespace ResearchCruiseApp_API.Models.AuthenticationModels;

public class LoginModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}