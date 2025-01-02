using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Application.Models.DTOs.Account;


public class ForgotPasswordFormDto
{
    [EmailAddress]
    public required string Email { get; init; }
}