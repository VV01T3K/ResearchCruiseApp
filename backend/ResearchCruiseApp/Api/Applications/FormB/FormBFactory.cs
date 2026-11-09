using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal class FormBFactory(
    FormBCFieldsWriter formFieldsWriter,
    UniqueFormFieldResolver formsFieldsService
)
{
    public async Task<FormB> Create(FormBFields formBFields, CancellationToken cancellationToken)
    {
        var formB = ApplicationMappings.ToFormB(formBFields);

        await formFieldsWriter.AddPermissions(
            formB.Permissions,
            formBFields.Permissions,
            cancellationToken
        );
        await formFieldsWriter.AddUgUnits(
            formB.FormBUgUnits,
            formBFields.UgTeams,
            (ugUnit, ugTeamFields) =>
                new FormBUgUnit
                {
                    UgUnit = ugUnit,
                    NoOfEmployees = ugTeamFields.NoOfEmployees,
                    NoOfStudents = ugTeamFields.NoOfStudents,
                },
            cancellationToken
        );
        await formFieldsWriter.AddGuestUnits(
            formB.FormBGuestUnits,
            formBFields.GuestTeams,
            (guestUnit, guestTeamFields) =>
                new FormBGuestUnit
                {
                    GuestUnit = guestUnit,
                    NoOfPersons = guestTeamFields.NoOfPersons,
                },
            cancellationToken
        );
        await AddCrewMembers(formB, formBFields, cancellationToken);
        await formFieldsWriter.AddPorts(
            formB.FormBPorts,
            formBFields.Ports,
            (port, portCallFields) =>
                new FormBPort
                {
                    Port = port,
                    StartTime = portCallFields.StartTime,
                    EndTime = portCallFields.EndTime,
                },
            cancellationToken
        );
        await formFieldsWriter.AddCruiseDaysDetails(
            formB.CruiseDaysDetails,
            formBFields.CruiseDaysDetails,
            cancellationToken
        );
        await formFieldsWriter.AddShipEquipments(
            formB.ShipEquipments,
            formBFields.ShipEquipmentsIds,
            cancellationToken
        );

        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await formFieldsWriter.AddResearchEquipments(
            formB.FormBShortResearchEquipments,
            formBFields.ShortResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, shortTermEquipmentFields) =>
                new FormBShortResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    StartDate = shortTermEquipmentFields.StartDate,
                    EndDate = shortTermEquipmentFields.EndDate,
                },
            cancellationToken
        );
        await formFieldsWriter.AddResearchEquipments(
            formB.FormBLongResearchEquipments,
            formBFields.LongResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, longTermEquipmentFields) =>
                new FormBLongResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    Action = longTermEquipmentFields.Action.ToEnum<ResearchEquipmentAction>(),
                    Duration = longTermEquipmentFields.Duration,
                },
            cancellationToken
        );
        await formFieldsWriter.AddResearchEquipments(
            formB.FormBResearchEquipments,
            formBFields.ResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, researchEquipmentFields) =>
                new FormBResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    InsuranceStartDate = researchEquipmentFields.InsuranceStartDate,
                    InsuranceEndDate = researchEquipmentFields.InsuranceEndDate,
                    Permission = researchEquipmentFields.Permission,
                },
            cancellationToken
        );

        return formB;
    }

    private async Task AddCrewMembers(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedCrewMembers = new HashSet<CrewMember>();

        foreach (var crewMemberFields in formBFields.CrewMembers)
        {
            var crewMember = await formsFieldsService.GetUniqueCrewMember(
                crewMemberFields,
                alreadyAddedCrewMembers,
                cancellationToken
            );
            alreadyAddedCrewMembers.Add(crewMember);

            formB.CrewMembers.Add(crewMember);
        }
    }
}
