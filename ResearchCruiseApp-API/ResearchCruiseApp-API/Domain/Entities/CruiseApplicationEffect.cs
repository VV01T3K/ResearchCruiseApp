namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseApplicationEffect : Entity
{
    public CruiseApplication CruiseApplication { get; set; } = null!;

    public FormCResearchTask Effect { get; set; } = null!;

    public int Points { get; set; }
}