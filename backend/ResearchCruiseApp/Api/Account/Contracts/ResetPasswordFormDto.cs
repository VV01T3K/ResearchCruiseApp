using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Account.Contracts;

public class ResetPasswordFormDto
{
    public string Password { get; init; } = null!;

    [Compare(nameof(Password), ErrorMessage = "Hasła nie są identyczne")]
    public string PasswordConfirm { get; init; } = null!;

    public string ResetCode { get; init; } = null!;

    public string EmailBase64 { get; init; } = null!;
}
