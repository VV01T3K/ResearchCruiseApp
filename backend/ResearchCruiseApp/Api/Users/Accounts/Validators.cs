using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(request => request.Email)
            .NotEmpty()
            .WithName("Adres e-mail")
            .EmailAddress()
            .MaximumLength(256);
        RuleFor(request => request.FirstName).NotEmpty().WithName("Imię").MaximumLength(1024);
        RuleFor(request => request.LastName).NotEmpty().WithName("Nazwisko").MaximumLength(1024);
        RuleFor(request => request.Roles).NotEmpty().WithName("Rola");
    }
}

public sealed class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(request => request.Email)
            .EmailAddress()
            .WithName("Adres e-mail")
            .When(request => !string.IsNullOrEmpty(request.Email));
        RuleFor(request => request.Email).MaximumLength(256).WithName("Adres e-mail");
        RuleFor(request => request.FirstName).MaximumLength(1024).WithName("Imię");
        RuleFor(request => request.LastName).MaximumLength(1024).WithName("Nazwisko");
    }
}
