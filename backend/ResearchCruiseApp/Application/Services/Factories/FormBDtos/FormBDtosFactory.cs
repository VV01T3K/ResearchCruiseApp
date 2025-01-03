using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.PermissionDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormBDtos;

public class FormBDtosFactory(IMapper mapper, IPermissionDtosFactory permissionDtosFactory)
    : IFormBDtosFactory
{
    public async Task<FormBDto> Create(FormB formB, CancellationToken cancellationToken)
    {
        var formBDto = mapper.Map<FormBDto>(formB);

        await AddPermissions(formB, formBDto);

        return formBDto;
    }

    private async Task AddPermissions(FormB formB, FormBDto formBDto)
    {
        foreach (var permission in formB.Permissions)
        {
            var permissionDto = await permissionDtosFactory.Create(permission);
            formBDto.Permissions.Add(permissionDto);
        }
    }
}
