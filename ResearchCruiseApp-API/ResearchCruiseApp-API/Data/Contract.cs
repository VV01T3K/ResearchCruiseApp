using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Data;

public class Contract(int category, string institution, string location, string description, string file)
{
    [Range(0, 1)] public int Category { get; set; } = category;
    [MaxLength(50)]
    public string Institution { get; set; } = institution;
    [MaxLength(200)]
    public string Description { get; set; } = description;

    [MaxLength(50)] public string Location { get; set; } = location;
    public string File { get; set; } = file;
}