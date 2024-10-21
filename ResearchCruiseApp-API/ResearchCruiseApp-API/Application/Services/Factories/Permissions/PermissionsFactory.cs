using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.Permissions;


public class PermissionsFactory(IMapper mapper, ICompressor compressor) : IPermissionsFactory
{
    public async Task<Permission> Create(PermissionDto permissionDto)
    {
        var permission = mapper.Map<Permission>(permissionDto);

        if (permissionDto.Scan is not null)
        {
            permission.ScanName = permissionDto.Scan.Name;
            permission.ScanContent = await compressor.Compress(permissionDto.Scan.Content);
        }

        return permission;
    }
}