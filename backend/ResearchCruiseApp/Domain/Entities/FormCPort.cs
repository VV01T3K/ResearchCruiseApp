using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormCPort : Entity
{
    public FormC FormC { get; init; } = null!;

    public Port Port { get; init; } = null!;
    
    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}