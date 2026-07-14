using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class ContractReader(FileReader files)
{
    public async Task<ContractFields> Create(Contract contract)
    {
        var dto = ApplicationMappings.ToContractFields(contract);

        foreach (var file in contract.Files)
        {
            if (!string.IsNullOrEmpty(file.FileName) && file.FileContent is not null)
            {
                dto.Scans.Add(await files.FromCompressed(file.FileName, file.FileContent));
            }
        }

        return dto;
    }

    public async Task<ScoredContract> Create(FormAContract contract) =>
        new()
        {
            Id = contract.Id,
            Contract = await Create(contract.Contract),
            Points = contract.Points.ToString(),
        };
}
