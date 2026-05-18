using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.ApplicationForms.Mapping;

internal static partial class ApplicationMappings
{
    public static ResearchEquipment ToResearchEquipment(IResearchEquipmentDto dto) =>
        new() { Name = dto.Name };

    public static ResearchEquipmentDto ToResearchEquipmentDto(FormBResearchEquipment equipment) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ResearchEquipmentDto ToResearchEquipmentDto(FormCResearchEquipment equipment) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ShortResearchEquipmentDto ToShortResearchEquipmentDto(
        FormBShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static ShortResearchEquipmentDto ToShortResearchEquipmentDto(
        FormCShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static LongResearchEquipmentDto ToLongResearchEquipmentDto(
        FormBLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static LongResearchEquipmentDto ToLongResearchEquipmentDto(
        FormCLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static Port ToPort(PortDto dto) => new() { Name = dto.Name };

    public static PortDto ToPortDto(FormBPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };

    public static PortDto ToPortDto(FormCPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };
}
