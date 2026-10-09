using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(request => request.Password).NotEmpty().WithName("Hasło");
        RuleFor(request => request.NewPassword).NotEmpty().WithName("Nowe hasło");
    }
}
