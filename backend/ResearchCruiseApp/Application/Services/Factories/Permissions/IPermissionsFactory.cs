using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Permissions;


public interface IPermissionsFactory
{
    Task<Permission> Create(PermissionDto permissionDto);
}