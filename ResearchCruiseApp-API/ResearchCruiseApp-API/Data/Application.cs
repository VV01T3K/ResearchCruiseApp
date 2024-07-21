using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data.Interfaces;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools.Attributes;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Data;

public class Application : IYearBasedNumberedEntity
{
    [DatabaseGenerated((DatabaseGeneratedOption.Identity))]
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;

    public DateOnly Date { get; set; }
    
    public FormA? FormA { get; set; } = null!;
    
    public FormB? FormB { get; set; } = null!;
    
    public FormC? FormC { get; set; } = null!;

    public EvaluatedApplication? EvaluatedApplication { get; set; } = null!;
    
    public int Points { get; set; }
    
    public ApplicationStatus Status { get; set; }
}