using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data.ResearchTaskFolder;

public class OtherTask(int type, string description)
{
    public int Type { get; set; } = type;
    [MaxLength(200)] public string Decription { get; set; } = description;
}