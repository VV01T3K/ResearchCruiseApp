using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Projections;

internal class FormProjection(
    PermissionProjection permissions,
    ContractProjection contracts,
    FileProjection files
)
{
    public async Task<FormADto> Create(FormA form)
    {
        var dto = ApplicationMappings.ToFormADto(form);
        foreach (var permission in form.Permissions)
        {
            dto.Permissions.Add(await permissions.Create(permission));
        }

        foreach (var contract in form.FormAContracts)
        {
            dto.Contracts.Add(await contracts.Create(contract.Contract));
        }

        return dto;
    }

    public async Task<FormBDto> Create(FormB form)
    {
        var dto = ApplicationMappings.ToFormBDto(form);
        foreach (var permission in form.Permissions)
        {
            dto.Permissions.Add(await permissions.Create(permission));
        }

        return dto;
    }

    public async Task<FormCDto> Create(FormC form)
    {
        var dto = ApplicationMappings.ToFormCDto(form);
        foreach (var permission in form.Permissions)
        {
            dto.Permissions.Add(await permissions.Create(permission));
        }

        foreach (var contract in form.Contracts)
        {
            dto.Contracts.Add(await contracts.Create(contract));
        }

        foreach (var photo in form.Photos)
        {
            dto.Photos.Add(await files.FromCompressed(photo.Name, photo.Content));
        }

        return dto;
    }
}
