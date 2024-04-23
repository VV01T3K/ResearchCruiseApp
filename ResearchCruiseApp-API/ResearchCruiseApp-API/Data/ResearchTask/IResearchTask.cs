using System.ComponentModel.DataAnnotations;
namespace  ResearchCruiseApp_API.Data.ResearchTask;
public interface IResearchTask
{   
    [Range(0,11)]
    public int Type { get; set; }
    
}