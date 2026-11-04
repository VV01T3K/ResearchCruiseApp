using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RegisterAccountValidator : AbstractValidator<RegisterAccountRequest>
{
    public RegisterAccountValidator()
    {
        RuleFor(request => request.Email).NotEmpty().WithName("Adres e-mail").EmailAddress();
        RuleFor(request => request.FirstName).NotEmpty().WithName("Imię");
        RuleFor(request => request.LastName).NotEmpty().WithName("Nazwisko");
    }
}
