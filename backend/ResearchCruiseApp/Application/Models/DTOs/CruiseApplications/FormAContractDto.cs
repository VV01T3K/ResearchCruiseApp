namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class FormAContractDto
{
    public Guid Id { get; init; }

    public ContractDto Contract { get; set; } = null!;

    public string Points { get; init; } = "0";
}
