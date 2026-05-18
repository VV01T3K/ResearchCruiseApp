namespace ResearchCruiseApp.Api.Account.Contracts;

public class ChangePasswordFormDto
{
    public string Password { get; init; } = null!;

    public string NewPassword { get; init; } = null!;
}
