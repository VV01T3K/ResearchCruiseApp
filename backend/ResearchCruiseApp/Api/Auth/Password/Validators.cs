using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RequestPasswordResetValidator : AbstractValidator<RequestPasswordResetRequest>
{
    public RequestPasswordResetValidator()
    {
        RuleFor(request => request.Email).NotEmpty().WithName("Adres e-mail").EmailAddress();
    }
}

public sealed class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordValidator()
    {
        RuleFor(request => request.EmailBase64).NotEmpty().WithName("Adres e-mail");
        RuleFor(request => request.ResetCode).NotEmpty().WithName("Kod resetowania hasła");
        RuleFor(request => request.Password).NotEmpty().WithName("Hasło");
        RuleFor(request => request.PasswordConfirm)
            .Equal(request => request.Password)
            .WithName("Potwierdzenie hasła");
    }
}
