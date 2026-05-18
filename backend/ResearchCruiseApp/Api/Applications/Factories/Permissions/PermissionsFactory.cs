using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.Permissions;

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
