namespace ResearchCruiseApp.Application.Models.DTOs.Users;

public class UpdateUserFormDto
{
    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Role { get; init; }
}