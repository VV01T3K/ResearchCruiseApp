using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
    public static FormB ToFormB(FormBFields dto)
    {
        return new FormB { IsCruiseManagerPresent = dto.IsCruiseManagerPresent };
    }

    public static FormBFields ToFormBFields(FormB form)
    {
        return new FormBFields
        {
            IsCruiseManagerPresent = form.IsCruiseManagerPresent,
            Permissions = [],
            UgTeams = form.FormBUgUnits.Select(ToUgTeamFields).ToList(),
            GuestTeams = form.FormBGuestUnits.Select(ToGuestTeamFields).ToList(),
            CrewMembers = form.CrewMembers.Select(ToCrewMemberFields).ToList(),
            ShortResearchEquipments = form
                .FormBShortResearchEquipments.Select(ToShortTermResearchEquipmentFields)
                .ToList(),
            LongResearchEquipments = form
                .FormBLongResearchEquipments.Select(ToLongTermResearchEquipmentFields)
                .ToList(),
            Ports = form.FormBPorts.Select(ToPortCallFields).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayFields).ToList(),
            ResearchEquipments = form
                .FormBResearchEquipments.Select(ToResearchEquipmentFields)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
        };
    }
}
