namespace ResearchCruiseApp.Application.Models.DTOs.Users;


public class UserRoleToggleDto
{
    public string RoleName { get; init; } = null!;
    
    public bool AddRole { get; init; }
}