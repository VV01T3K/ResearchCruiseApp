using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(request => request.Email).NotEmpty().WithName("Adres e-mail").EmailAddress();
        RuleFor(request => request.FirstName).NotEmpty().WithName("Imię");
        RuleFor(request => request.LastName).NotEmpty().WithName("Nazwisko");
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
    }
}
