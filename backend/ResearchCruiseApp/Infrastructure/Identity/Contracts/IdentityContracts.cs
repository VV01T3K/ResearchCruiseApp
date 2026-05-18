using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Infrastructure.Identity.Contracts;

public class LoginFormDto
{
    public required string Email { get; init; }

    public required string Password { get; init; }
}

public class RegisterFormDto
{
    public required string Email { get; init; }

    public required string Password { get; init; }

    public required string FirstName { get; init; }

    public required string LastName { get; init; }
}

public class ChangePasswordFormDto
{
    public string Password { get; init; } = null!;

    public string NewPassword { get; init; } = null!;
}

public class ForgotPasswordFormDto
{
    [EmailAddress]
    public required string Email { get; init; }
}

public class ResetPasswordFormDto
{
    public string Password { get; init; } = null!;

    [Compare(nameof(Password), ErrorMessage = "Hasła nie są identyczne")]
    public string PasswordConfirm { get; init; } = null!;

    public string ResetCode { get; init; } = null!;

    public string EmailBase64 { get; init; } = null!;
}

public class RefreshDto
{
    public string AccessToken { get; set; } = null!;

    public string RefreshToken { get; init; } = null!;
}

public class LoginResponseDto
{
    public string AccessToken { get; set; } = null!;

    public DateTime AccessTokenExpirationDate { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshTokenExpirationDate { get; set; }
}
