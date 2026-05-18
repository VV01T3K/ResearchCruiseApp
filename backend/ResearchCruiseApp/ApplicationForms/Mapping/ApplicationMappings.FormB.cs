using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.ApplicationForms.Mapping;

internal static partial class ApplicationMappings
{
    public static FormB ToFormB(FormBDto dto)
    {
        return new FormB { IsCruiseManagerPresent = dto.IsCruiseManagerPresent };
    }

    public static FormBDto ToFormBDto(FormB form)
    {
        return new FormBDto
        {
            IsCruiseManagerPresent = form.IsCruiseManagerPresent,
            UgTeams = form.FormBUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormBGuestUnits.Select(ToGuestTeamDto).ToList(),
            CrewMembers = form.CrewMembers.Select(ToCrewMemberDto).ToList(),
            ShortResearchEquipments = form
                .FormBShortResearchEquipments.Select(ToShortResearchEquipmentDto)
                .ToList(),
            LongResearchEquipments = form
                .FormBLongResearchEquipments.Select(ToLongResearchEquipmentDto)
                .ToList(),
            Ports = form.FormBPorts.Select(ToPortDto).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayDetailsDto).ToList(),
            ResearchEquipments = form
                .FormBResearchEquipments.Select(ToResearchEquipmentDto)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
        };
    }
}
