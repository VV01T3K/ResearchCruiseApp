using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp_API.Application.Services.Factories.FileDtos;
using ResearchCruiseApp_API.Application.Services.Factories.PermissionDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormCDtos;


public class FormCDtosFactory(
    IMapper mapper,
    IPermissionDtosFactory permissionDtosFactory,
    IContractDtosFactory contractDtosFactory,
    IFileDtosFactory fileDtosFactory)
    : IFormCDtosFactory
{
    public async Task<FormCDto> Create(FormC formC)
    {
        var formCDto = mapper.Map<FormCDto>(formC);

        await AddPermissions(formC, formCDto);
        await AddContracts(formC, formCDto);
        await AddPhotos(formC, formCDto);

        return formCDto;
    }


    private async Task AddPermissions(FormC formC, FormCDto formCDto)
    {
        foreach (var permission in formC.Permissions)
        {
            var permissionDto = await permissionDtosFactory.Create(permission);
            formCDto.Permissions.Add(permissionDto);
        }
    }
    
    private async Task AddContracts(FormC formC, FormCDto formCDto)
    {
        foreach (var contract in formC.Contracts)
        {
            var contractDto = await contractDtosFactory.Create(contract);
            formCDto.Contracts.Add(contractDto);
        }
    }

    private async Task AddPhotos(FormC formC, FormCDto formCDto)
    {
        foreach (var photo in formC.Photos)
        {
            var fileDto = await fileDtosFactory.CreateFromCompressed(photo.Name, photo.Content);
            formCDto.Photos.Add(fileDto);
        }
    }
}