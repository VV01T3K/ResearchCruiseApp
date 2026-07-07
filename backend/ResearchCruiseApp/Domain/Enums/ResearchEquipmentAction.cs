using ResearchCruiseApp.Domain.Attributes;

namespace ResearchCruiseApp.Domain.Enums;

public enum ResearchEquipmentAction
{
    [StringValue("put")]
    Put = 0,

    [StringValue("collect")]
    Collect = 1,
}
