using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Account;


public class ForgotPasswordFormDto
{
    [EmailAddress]
    public required string Email { get; init; }
}