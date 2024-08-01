namespace ResearchCruiseApp_API.Application.UseCases.Account.DTOs;


public class LoginModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}