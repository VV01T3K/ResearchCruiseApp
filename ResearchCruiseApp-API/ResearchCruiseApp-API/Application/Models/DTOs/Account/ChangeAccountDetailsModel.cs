namespace ResearchCruiseApp_API.Application.Models.DTOs.Account;


public class ChangeAccountDetailsModel
{
    public string? NewFirstName { get; set; }
    public string? NewLastName { get; set; }
    public string? Password { get; set; }
    public string? NewPassword { get; set; }
}