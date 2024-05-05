using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTask;

public class OtherTask(int type, string description):ResearchTask
{
    public int Type { get; set; } = type;
    [MaxLength(200)] public string Decription { get; set; } = description;
}