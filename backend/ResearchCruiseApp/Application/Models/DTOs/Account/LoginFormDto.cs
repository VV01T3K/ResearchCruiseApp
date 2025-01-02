namespace ResearchCruiseApp.Application.Models.DTOs.Account;


public class LoginFormDto
{
    public required string Email { get; init; }
    
    public required string Password { get; init; }
}