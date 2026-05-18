using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Projections;

internal class PermissionProjection(FileProjection files)
{
    public async Task<PermissionDto> Create(Permission permission)
    {
        var dto = ApplicationMappings.ToPermissionDto(permission);
        if (permission.ScanName is not null && permission.ScanContent is not null)
        {
            dto.Scan = await files.FromCompressed(permission.ScanName, permission.ScanContent);
        }

        return dto;
    }
}
