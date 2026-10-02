using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class RegisterAccountValidator : AbstractValidator<RegisterAccountRequest>
{
    public RegisterAccountValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.FirstName).NotEmpty().MaximumLength(1024);
        RuleFor(request => request.LastName).NotEmpty().MaximumLength(1024);
    }
}
