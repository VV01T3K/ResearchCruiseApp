namespace ResearchCruiseApp.Api.Account.Contracts;

public class LoginFormDto
{
    public required string Email { get; init; }

    public required string Password { get; init; }
}
