namespace ResearchCruiseApp.Application.Models.DTOs.Users;


public class AddUserFormDto
{
    public required string Email { get; init; }
    
    public required string FirstName { get; init; }
    
    public required string LastName { get; init; }
    
    public string? Role { get; init; }
}
