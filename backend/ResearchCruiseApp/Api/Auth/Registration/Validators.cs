using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RegisterAccountValidator : AbstractValidator<RegisterAccountRequest>
{
    public RegisterAccountValidator()
    {
        RuleFor(request => request.Email)
            .NotEmpty()
            .WithName("Adres e-mail")
            .EmailAddress()
            .MaximumLength(256);
        RuleFor(request => request.Password).NotEmpty().WithName("Hasło");
        RuleFor(request => request.FirstName).NotEmpty().WithName("Imię").MaximumLength(1024);
        RuleFor(request => request.LastName).NotEmpty().WithName("Nazwisko").MaximumLength(1024);
    }
}
