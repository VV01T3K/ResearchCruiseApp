using ResearchCruiseApp.Domain.Attributes;

namespace ResearchCruiseApp.Domain.Enums;

public enum CruiseStatus
{
    [StringValue("Nowy")]
    New,

    [StringValue("Potwierdzony")]
    Confirmed,

    [StringValue("Zakończony")]
    Ended,
}
