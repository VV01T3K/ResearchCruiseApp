namespace ResearchCruiseApp_API.Application.DTOs.Users;


public class ToggleUserRoleModel
{
    public string RoleName { get; init; } = null!;
    public bool AddRole { get; init; }
}