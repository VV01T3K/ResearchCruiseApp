namespace ResearchCruiseApp.Application.Models.DTOs.Cruises;

public class CruiseApplicationShortInfoDto
{
    public Guid Id { get; set; }

    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }

    public string Number { get; set; } = null!;

    public string Points { get; set; } = null!;
}
