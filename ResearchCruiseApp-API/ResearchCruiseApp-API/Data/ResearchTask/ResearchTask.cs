using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace  ResearchCruiseApp_API.Data.ResearchTask;
public abstract class ResearchTask
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public int Type { get; set; }

    public string? Title { get; set; }
    public string? Author { get; set; }
    public string? Institution { get; set; }
    //zmienić w frontendzie na DATETIME
    public string? Date { get; set; }
    public struct Time_type
    {
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
    }
    public Time_type Time { get; set; }
    //zmienić w frontendzie na int
    public string? FinancingAmount { get; set; }
    public string? Description { get; set; }
}