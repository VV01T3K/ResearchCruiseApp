using ResearchCruiseApp.Domain.Common.Attributes;

namespace ResearchCruiseApp.Domain.Common.Enums;


public enum CruiseStatus
{
    [StringValue("Nowy")]
    New,
    
    [StringValue("Potwierdzony")]
    Confirmed,
        
    [StringValue("Zakończony")]
    Ended,
    
}