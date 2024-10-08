using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormCResearchTask : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchTask ResearchTask { get; init; } = null!;

    [StringLength(1024)]
    public string Done { get; init; } = null!;

    [StringLength(1024)]
    public string ManagerConditionMet { get; init; } = null!;
    
    [StringLength(1024)]
    public string DeputyConditionMet { get; init; } = null!;
}