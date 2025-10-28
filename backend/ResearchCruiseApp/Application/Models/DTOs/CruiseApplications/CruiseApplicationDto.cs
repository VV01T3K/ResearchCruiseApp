namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class CruiseApplicationDto
{
    public Guid Id { get; init; }

    public string Number { get; init; } = null!;

    public DateOnly Date { get; init; }

    public int Year { get; init; }

    public Guid CruiseManagerId { get; init; }

    public string CruiseManagerEmail { get; set; } = null!;

    public string CruiseManagerFirstName { get; set; } = null!;

    public string CruiseManagerLastName { get; set; } = null!;

    public Guid DeputyManagerId { get; init; }

    public string DeputyManagerEmail { get; set; } = null!;

    public string DeputyManagerFirstName { get; set; } = null!;

    public string DeputyManagerLastName { get; set; } = null!;

    public bool HasFormA { get; init; }

    public bool HasFormB { get; init; }

    public bool HasFormC { get; init; }

    public int Points { get; set; }

    public string Status { get; init; } = null!;

    public string EffectsDoneRate { get; set; } = "0";

    public string? Note { get; init; }

    public string? CruiseHours { get; init; }

    public int? CruiseDays { get; set; }

    public string? AcceptablePeriodBeg { get; init; }

    public string? AcceptablePeriodEnd { get; init; }

    public string? OptimalPeriodBeg { get; init; }

    public string? OptimalPeriodEnd { get; init; }

    public DateTime? PrecisePeriodStart { get; init; }

    public DateTime? PrecisePeriodEnd { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }
}
