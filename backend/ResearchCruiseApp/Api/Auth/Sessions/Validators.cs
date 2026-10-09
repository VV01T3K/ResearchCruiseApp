using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(request => request.Email).NotEmpty().WithName("Adres e-mail").EmailAddress();
        RuleFor(request => request.Password).NotEmpty().WithName("Hasło");
    }
}
