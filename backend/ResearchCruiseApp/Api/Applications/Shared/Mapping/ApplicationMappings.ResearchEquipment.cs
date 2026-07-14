using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
    public static ResearchEquipment ToResearchEquipment(IResearchEquipmentFields dto) =>
        new() { Name = dto.Name };

    public static ResearchEquipmentFields ToResearchEquipmentFields(
        FormBResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ResearchEquipmentFields ToResearchEquipmentFields(
        FormCResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ShortTermResearchEquipmentFields ToShortTermResearchEquipmentFields(
        FormBShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static ShortTermResearchEquipmentFields ToShortTermResearchEquipmentFields(
        FormCShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static LongTermResearchEquipmentFields ToLongTermResearchEquipmentFields(
        FormBLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static LongTermResearchEquipmentFields ToLongTermResearchEquipmentFields(
        FormCLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static Port ToPort(PortCallFields dto) => new() { Name = dto.Name };

    public static PortCallFields ToPortCallFields(FormBPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };

    public static PortCallFields ToPortCallFields(FormCPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };
}
