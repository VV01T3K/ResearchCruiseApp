using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.ApplicationForms.Mapping;

internal static partial class ApplicationMappings
{
    public static FormC ToFormC(FormCDto dto)
    {
        return new FormC
        {
            ShipUsage = dto.ShipUsage,
            DifferentUsage = dto.DifferentUsage,
            CollectedSamples = dto.CollectedSamples.Select(ToCollectedSample).ToList(),
            SpubReportData = dto.SpubReportData,
            AdditionalDescription = dto.AdditionalDescription,
        };
    }

    public static FormCDto ToFormCDto(FormC form)
    {
        return new FormCDto
        {
            ShipUsage = form.ShipUsage,
            DifferentUsage = form.DifferentUsage,
            ResearchAreaDescriptions = form
                .ResearchAreaDescriptions.Select(ToResearchAreaDescriptionDto)
                .ToList(),
            UgTeams = form.FormCUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormCGuestUnits.Select(ToGuestTeamDto).ToList(),
            ResearchTasksEffects = form
                .ResearchTaskEffects.Select(ToResearchTaskEffectDto)
                .ToList(),
            SpubTasks = form.SpubTasks.Select(ToSpubTaskDto).ToList(),
            ShortResearchEquipments = form
                .FormCShortResearchEquipments.Select(ToShortResearchEquipmentDto)
                .ToList(),
            LongResearchEquipments = form
                .FormCLongResearchEquipments.Select(ToLongResearchEquipmentDto)
                .ToList(),
            Ports = form.FormCPorts.Select(ToPortDto).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayDetailsDto).ToList(),
            ResearchEquipments = form
                .FormCResearchEquipments.Select(ToResearchEquipmentDto)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
            CollectedSamples = form.CollectedSamples.Select(ToCollectedSampleDto).ToList(),
            SpubReportData = form.SpubReportData,
            AdditionalDescription = form.AdditionalDescription,
        };
    }
}
