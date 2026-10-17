using Microsoft.AspNetCore.Identity;

namespace ResearchCruiseApp.Infrastructure.Identity;

// Identity errors are returned to users as ProblemDetails, so they need to be in Polish.
// Codes stay the same as Identity's, because code paths compare them.
internal sealed class PolishIdentityErrorDescriber : IdentityErrorDescriber
{
    public override IdentityError DefaultError() =>
        Error(nameof(DefaultError), "Wystąpił nieznany błąd.");

    public override IdentityError ConcurrencyFailure() =>
        Error(
            nameof(ConcurrencyFailure),
            "Dane konta zmieniły się w międzyczasie. Spróbuj ponownie."
        );

    public override IdentityError PasswordMismatch() =>
        Error(nameof(PasswordMismatch), "Podane hasło jest nieprawidłowe.");

    public override IdentityError InvalidToken() =>
        Error(nameof(InvalidToken), "Link jest nieprawidłowy lub wygasł.");

    public override IdentityError RecoveryCodeRedemptionFailed() =>
        Error(nameof(RecoveryCodeRedemptionFailed), "Nie udało się użyć kodu odzyskiwania.");

    public override IdentityError LoginAlreadyAssociated() =>
        Error(nameof(LoginAlreadyAssociated), "Użytkownik z tym loginem już istnieje.");

    public override IdentityError InvalidUserName(string? userName) =>
        Error(nameof(InvalidUserName), $"Nazwa użytkownika '{userName}' jest nieprawidłowa.");

    public override IdentityError InvalidEmail(string? email) =>
        Error(nameof(InvalidEmail), $"Adres e-mail '{email}' jest nieprawidłowy.");

    // Accounts use the e-mail address as the user name.
    public override IdentityError DuplicateUserName(string userName) =>
        Error(nameof(DuplicateUserName), $"Adres e-mail '{userName}' jest już zajęty.");

    public override IdentityError DuplicateEmail(string email) =>
        Error(nameof(DuplicateEmail), $"Adres e-mail '{email}' jest już zajęty.");

    public override IdentityError InvalidRoleName(string? role) =>
        Error(nameof(InvalidRoleName), $"Nazwa roli '{role}' jest nieprawidłowa.");

    public override IdentityError DuplicateRoleName(string role) =>
        Error(nameof(DuplicateRoleName), $"Rola '{role}' już istnieje.");

    public override IdentityError UserAlreadyHasPassword() =>
        Error(nameof(UserAlreadyHasPassword), "Użytkownik ma już ustawione hasło.");

    public override IdentityError UserLockoutNotEnabled() =>
        Error(
            nameof(UserLockoutNotEnabled),
            "Blokada konta nie jest włączona dla tego użytkownika."
        );

    public override IdentityError UserAlreadyInRole(string role) =>
        Error(nameof(UserAlreadyInRole), $"Użytkownik ma już rolę '{role}'.");

    public override IdentityError UserNotInRole(string role) =>
        Error(nameof(UserNotInRole), $"Użytkownik nie ma roli '{role}'.");

    public override IdentityError PasswordTooShort(int length) =>
        Error(nameof(PasswordTooShort), $"Hasło musi mieć co najmniej {length} znaków.");

    public override IdentityError PasswordRequiresUniqueChars(int uniqueChars) =>
        Error(
            nameof(PasswordRequiresUniqueChars),
            $"Hasło musi zawierać co najmniej {uniqueChars} różnych znaków."
        );

    public override IdentityError PasswordRequiresNonAlphanumeric() =>
        Error(
            nameof(PasswordRequiresNonAlphanumeric),
            "Hasło musi zawierać co najmniej jeden znak specjalny."
        );

    public override IdentityError PasswordRequiresDigit() =>
        Error(nameof(PasswordRequiresDigit), "Hasło musi zawierać co najmniej jedną cyfrę.");

    public override IdentityError PasswordRequiresLower() =>
        Error(nameof(PasswordRequiresLower), "Hasło musi zawierać co najmniej jedną małą literę.");

    public override IdentityError PasswordRequiresUpper() =>
        Error(
            nameof(PasswordRequiresUpper),
            "Hasło musi zawierać co najmniej jedną wielką literę."
        );

    private static IdentityError Error(string code, string description) =>
        new() { Code = code, Description = description };
}
