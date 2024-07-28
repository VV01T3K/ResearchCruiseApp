namespace ResearchCruiseApp_API.Application.UseCaseServices.Users.DTOs;


public class AddUserFormDto
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public string? Role { get; init; }
}