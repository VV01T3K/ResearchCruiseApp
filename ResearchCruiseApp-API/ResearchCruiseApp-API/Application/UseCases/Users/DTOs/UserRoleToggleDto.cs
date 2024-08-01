namespace ResearchCruiseApp_API.Application.UseCases.Users.DTOs;


public class UserRoleToggleDto
{
    public string RoleName { get; init; } = null!;
    public bool AddRole { get; init; }
}