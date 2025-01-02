using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormBPort : Entity
{
    public FormB FormB { get; init; } = null!;

    public Port Port { get; set; } = null!;
    
    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}