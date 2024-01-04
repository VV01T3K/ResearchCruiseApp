namespace ResearchCruiseApp_API.Models.AuthenticationRequestsModels;

public class LoginModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}