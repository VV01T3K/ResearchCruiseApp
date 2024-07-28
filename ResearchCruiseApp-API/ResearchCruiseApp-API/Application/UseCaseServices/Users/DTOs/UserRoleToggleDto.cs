namespace ResearchCruiseApp_API.Application.UseCaseServices.Users.DTOs;


public class UserRoleToggleDto
{
    public string RoleName { get; init; } = null!;
    public bool AddRole { get; init; }
}