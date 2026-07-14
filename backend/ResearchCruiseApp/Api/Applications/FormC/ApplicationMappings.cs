using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
    public static FormC ToFormC(FormCFields dto)
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

    public static FormCFields ToFormCFields(FormC form)
    {
        return new FormCFields
        {
            ShipUsage = form.ShipUsage,
            DifferentUsage = form.DifferentUsage,
            Permissions = [],
            ResearchAreaDescriptions = form
                .ResearchAreaDescriptions.Select(ToResearchAreaSelection)
                .ToList(),
            UgTeams = form.FormCUgUnits.Select(ToUgTeamFields).ToList(),
            GuestTeams = form.FormCGuestUnits.Select(ToGuestTeamFields).ToList(),
            ResearchTasksEffects = form
                .ResearchTaskEffects.Select(ToResearchTaskEffectFields)
                .ToList(),
            Contracts = [],
            SpubTasks = form.SpubTasks.Select(ToSpubTaskFields).ToList(),
            ShortResearchEquipments = form
                .FormCShortResearchEquipments.Select(ToShortTermResearchEquipmentFields)
                .ToList(),
            LongResearchEquipments = form
                .FormCLongResearchEquipments.Select(ToLongTermResearchEquipmentFields)
                .ToList(),
            Ports = form.FormCPorts.Select(ToPortCallFields).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayFields).ToList(),
            ResearchEquipments = form
                .FormCResearchEquipments.Select(ToResearchEquipmentFields)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
            CollectedSamples = form.CollectedSamples.Select(ToCollectedSampleFields).ToList(),
            SpubReportData = form.SpubReportData,
            AdditionalDescription = form.AdditionalDescription,
            Photos = [],
        };
    }
}
