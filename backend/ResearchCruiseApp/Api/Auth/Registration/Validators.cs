using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RegisterAccountValidator : AbstractValidator<RegisterAccountRequest>
{
    public RegisterAccountValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.FirstName).NotEmpty();
        RuleFor(request => request.LastName).NotEmpty();
    }
}
