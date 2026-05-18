using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.FileDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.PermissionDtos;

public class PermissionDtosFactory(IMapper mapper, IFileDtosFactory fileDtosFactory)
    : IPermissionDtosFactory
{
    public async Task<PermissionDto> Create(Permission permission)
    {
        var permissionDto = mapper.Map<PermissionDto>(permission);

        if (permission.ScanName is not null && permission.ScanContent is not null)
            permissionDto.Scan = await fileDtosFactory.CreateFromCompressed(
                permission.ScanName,
                permission.ScanContent
            );

        return permissionDto;
    }
}
