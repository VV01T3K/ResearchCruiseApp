using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class ResendConfirmationEmailValidator
    : AbstractValidator<ResendConfirmationEmailRequest>
{
    public ResendConfirmationEmailValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
    }
}
