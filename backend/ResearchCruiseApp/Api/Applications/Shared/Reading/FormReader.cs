using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class FormReader(PermissionReader permissions, ContractReader contracts, FileReader files)
{
    public async Task<FormAFields> Create(FormA form)
    {
        var dto = ApplicationMappings.ToFormAFields(form);
        foreach (var permission in form.Permissions)
        {
            dto.Permissions.Add(await permissions.Create(permission));
        }

        foreach (var contract in form.FormAContracts)
        {
            dto.Contracts.Add(await contracts.Create(contract.Contract));
        }

        foreach (var file in form.ResearchAreaFiles)
        {
            dto.ResearchAreaFiles.Add(await files.FromCompressed(file.FileName, file.FileContent));
        }

        return dto;
    }

    public async Task<FormBFields> Create(FormB form)
    {
        var dto = ApplicationMappings.ToFormBFields(form);
        foreach (var permission in form.Permissions)
        {
            dto.Permissions.Add(await permissions.Create(permission));
        }

        return dto;
    }

    public async Task<FormCFields> Create(FormC form)
    {
        var dto = ApplicationMappings.ToFormCFields(form);
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
