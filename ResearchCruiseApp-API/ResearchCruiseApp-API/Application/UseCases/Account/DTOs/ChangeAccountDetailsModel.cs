namespace ResearchCruiseApp_API.Application.UseCases.Account.DTOs;


public class ChangeAccountDetailsModel
{
    public string? NewFirstName { get; set; }
    public string? NewLastName { get; set; }
    public string? Password { get; set; }
    public string? NewPassword { get; set; }
}