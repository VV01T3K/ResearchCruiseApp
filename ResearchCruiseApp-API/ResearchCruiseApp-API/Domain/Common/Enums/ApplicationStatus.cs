using ResearchCruiseApp_API.Infrastructure.Tools.Attributes;

namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum ApplicationStatus
{
    [StringValue("Nowe")]
    New,
        
    [StringValue("Zaakceptowane")]
    Accepted,
        
    [StringValue("Zrealizowane")]
    Undertaken,
        
    [StringValue("Rozliczone")]
    Reported
}