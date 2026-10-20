using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class ReplaceUserRoleValidator : AbstractValidator<ReplaceUserRoleRequest>
{
    public ReplaceUserRoleValidator()
    {
        RuleFor(request => request.RoleName).NotEmpty().WithName("Rola");
    }
}
