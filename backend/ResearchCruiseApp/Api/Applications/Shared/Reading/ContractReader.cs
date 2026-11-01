using System.Globalization;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class ContractReader(FileReader files, ILogger<ContractReader> logger)
{
    public async Task<ContractFields> Create(Contract contract)
    {
        var dto = ApplicationMappings.ToContractFields(contract);

        foreach (var file in contract.Files)
        {
            if (file.FileContent is null)
                continue;

            var name = file.FileName;
            if (string.IsNullOrEmpty(name))
            {
                name = $"umowa-{file.Id}";
                logger.LogWarning(
                    "Contract {ContractId} has unnamed file {FileId}",
                    contract.Id,
                    file.Id
                );
            }

            dto.Scans.Add(await files.FromCompressed(name, file.FileContent));
        }

        return dto;
    }

    public async Task<ScoredContract> Create(FormAContract contract) =>
        new()
        {
            Id = contract.Id,
            Contract = await Create(contract.Contract),
            Points = contract.Points.ToString(CultureInfo.InvariantCulture),
        };
}
