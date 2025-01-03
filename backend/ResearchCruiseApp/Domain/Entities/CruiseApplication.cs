using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Domain.Entities;

public class CruiseApplication : Entity
{
    public int Number { get; set; }

    public DateOnly Date { get; set; }

    public FormA? FormA { get; set; }

    public FormB? FormB { get; set; }

    public FormC? FormC { get; set; }

    public CruiseApplicationStatus Status { get; set; }

    public byte[] SupervisorCode { get; init; } = [];

    public Cruise? Cruise { get; set; }

    public int EffectsPoints { get; set; }

    [StringLength(1024)]
    public string? Note { get; set; }
}
