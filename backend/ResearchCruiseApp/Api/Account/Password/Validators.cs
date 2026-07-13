using FluentValidation;

namespace ResearchCruiseApp.Api.Account;

public sealed class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.NewPassword).NotEmpty();
    }
}
