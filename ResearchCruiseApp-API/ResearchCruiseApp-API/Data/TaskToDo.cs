namespace ResearchCruiseApp_API.Data;

public class TaskToDo
{
    public int Id { get; set; }
    public string Type { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Time_frame { get; set; } = null!;
    public string Financing_amount { get; set; } = null!;
    public FormA FormA { get; set; } = null!;
}