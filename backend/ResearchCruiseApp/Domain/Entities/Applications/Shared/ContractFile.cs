namespace ResearchCruiseApp.Domain.Entities;

public class ContractFile : Entity
{
    public string? FileName { get; set; }

    public byte[]? FileContent { get; set; }
    public Guid ContractId { get; init; }

    public Contract? Contract { get; init; }
}
