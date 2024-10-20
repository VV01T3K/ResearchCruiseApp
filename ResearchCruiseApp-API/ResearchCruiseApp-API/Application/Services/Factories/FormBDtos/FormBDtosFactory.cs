using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.PermissionDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormBDtos;


public class FormBDtosFactory(IMapper mapper, IPermissionDtosFactory permissionDtosFactory) : IFormBDtosFactory
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