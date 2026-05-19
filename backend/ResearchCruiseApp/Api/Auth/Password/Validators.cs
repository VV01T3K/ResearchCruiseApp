using FluentValidation;

namespace ResearchCruiseApp.Api.Auth;

public sealed class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.NewPassword).NotEmpty();
    }
}

public sealed class RequestPasswordResetValidator
    : AbstractValidator<RequestPasswordResetRequest>
{
    public RequestPasswordResetValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
    }
}

public sealed class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordValidator()
    {
        RuleFor(request => request.EmailBase64).NotEmpty();
        RuleFor(request => request.ResetCode).NotEmpty();
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.PasswordConfirm).Equal(request => request.Password);
    }
}
