using ResearchCruiseApp_API.Domain.Common.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum CruiseStatus
{
    [StringValue("Nowy")]
    New,
    
    [StringValue("Potwierdzony")]
    Confirmed,
    
    [StringValue("Rozpoczęty")]
    Started,
        
    [StringValue("Zakończony")]
    Ended,
    
    [StringValue("Archiwalny")]
    Archive,
    
}