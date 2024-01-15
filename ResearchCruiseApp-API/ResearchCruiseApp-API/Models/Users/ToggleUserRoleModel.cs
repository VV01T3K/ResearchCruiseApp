using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Models.Users;

public class ToggleUserRoleModel
{
    public string RoleName { get; init; } = null!;
    public bool AddRole { get; init; }
}