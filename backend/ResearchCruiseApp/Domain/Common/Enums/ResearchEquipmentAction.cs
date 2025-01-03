using ResearchCruiseApp.Domain.Common.Attributes;

namespace ResearchCruiseApp.Domain.Common.Enums;

public enum ResearchEquipmentAction
{
    [StringValue("put")]
    Put = 0,

    [StringValue("collect")]
    Collect = 1,
}
