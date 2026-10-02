using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(request => request.FirstName).NotEmpty().MaximumLength(1024);
        RuleFor(request => request.LastName).NotEmpty().MaximumLength(1024);
        RuleFor(request => request.Roles).NotEmpty();
    }
}

public sealed class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(request => request.Email)
            .EmailAddress()
            .When(request => !string.IsNullOrEmpty(request.Email));
        RuleFor(request => request.Email).MaximumLength(256);
        RuleFor(request => request.FirstName).MaximumLength(1024);
        RuleFor(request => request.LastName).MaximumLength(1024);
    }
}
