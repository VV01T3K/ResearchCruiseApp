using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class PermissionReader(FileReader files)
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
