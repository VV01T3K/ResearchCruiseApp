namespace ResearchCruiseApp.Application.Models.DTOs.Account;

public class ChangePasswordFormDto
{
    public string Password { get; init; } = null!;

    public string NewPassword { get; init; } = null!;
}
