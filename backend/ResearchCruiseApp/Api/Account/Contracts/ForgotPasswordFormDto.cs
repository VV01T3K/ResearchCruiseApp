using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Api.Account.Contracts;

public class ForgotPasswordFormDto
{
    [EmailAddress]
    public required string Email { get; init; }
}
