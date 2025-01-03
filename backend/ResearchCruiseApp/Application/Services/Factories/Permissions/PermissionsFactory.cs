using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Permissions;

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
