using System.Text.Json.Serialization;

namespace ResearchCruiseApp_API.Models.DataTypes;

public class ResearchTask
{
    //Zadania
    //typ zadania np licencjacka, magisterska
    public int Type { get; set; }
    public class Value
    {
        public string? Title { get; set; }
        
        public string? Author { get; set; }
        
        public string? Institution { get; set; }
        
        //TODO zmienić w frontendzie na DATETIME
        public DateTime? Date { get; set; }
        
        public class Time_type
        {
            public string? StartDate { get; set; } = null!;
            public string? EndDate { get; set; } = null!;
        }
        
        public Time_type? Time { get; set; }
        
        //TODO zmienić w frontendzie na int
        public double? FinancingAmount { get; set; }
        
        public string? Description { get; set; }
    }
    public Value Values { get; set; } 
}