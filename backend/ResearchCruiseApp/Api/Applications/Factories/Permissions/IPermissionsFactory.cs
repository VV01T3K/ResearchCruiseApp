using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.Permissions;

public interface IPermissionsFactory
{
    Task<Permission> Create(PermissionDto permissionDto);
}
