namespace ResearchCruiseApp_API.Application.Models.DTOs.Account;


public class LoginModel
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}