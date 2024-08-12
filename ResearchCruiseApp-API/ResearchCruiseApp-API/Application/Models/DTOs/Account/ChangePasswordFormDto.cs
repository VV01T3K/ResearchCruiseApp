namespace ResearchCruiseApp_API.Application.Models.DTOs.Account;


public class ChangePasswordFormDto
{
    public string Password { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}