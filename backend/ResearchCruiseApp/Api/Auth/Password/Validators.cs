using System.Text;
using FluentValidation;
using NeoSmart.Utils;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RequestPasswordResetValidator : AbstractValidator<RequestPasswordResetRequest>
{
    public RequestPasswordResetValidator()
    {
        RuleFor(request => request.Email)
            .NotEmpty()
            .WithName("Adres e-mail")
            .EmailAddress()
            .MaximumLength(256);
    }
}

public sealed class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordValidator()
    {
        RuleFor(request => request.EmailBase64)
            .NotEmpty()
            .Must(IsEncodedEmail)
            .WithName("Adres e-mail");
        RuleFor(request => request.ResetCode).NotEmpty().WithName("Kod resetowania hasła");
        RuleFor(request => request.Password).NotEmpty().WithName("Hasło");
        RuleFor(request => request.PasswordConfirm)
            .Equal(request => request.Password)
            .WithName("Potwierdzenie hasła");
    }

    private static bool IsEncodedEmail(string? emailBase64)
    {
        try
        {
            return emailBase64 is null
                || Encoding.UTF8.GetString(UrlBase64.Decode(emailBase64)).Length <= 256;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
