namespace ResearchCruiseApp_API.Application.DTOs.Users;


public class LoginModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}