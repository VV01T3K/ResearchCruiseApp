using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class FormAContract : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public Contract Contract { get; init; } = null!;

    public int Points { get; set; }
}