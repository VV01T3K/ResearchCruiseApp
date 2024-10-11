namespace ResearchCruiseApp_API.Domain.Entities;


public class FormCSpubTask : Entity
{
    public FormC FormC { get; set; } = null!;

    public SpubTask SpubTask { get; set; } = null!;
}