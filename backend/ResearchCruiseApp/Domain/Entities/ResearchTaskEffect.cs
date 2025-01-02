using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class ResearchTaskEffect : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchTask ResearchTask { get; init; } = null!;

    [StringLength(1024)]
    public string Done { get; init; } = null!;

    [StringLength(1024)]
    public string? PublicationMinisterialPoints { get; init; }
    
    [StringLength(1024)]
    public string ManagerConditionMet { get; init; } = null!;
    
    [StringLength(1024)]
    public string DeputyConditionMet { get; init; } = null!;
    
    public List<UserEffect> UserEffects { get; set; } = [];
}