using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

internal class FormBFactory(
    ApplicationDbContext dbContext,
    UniqueFormFieldResolver formsFieldsService
)
{
    public async Task<FormB> Create(FormBFields formBFields, CancellationToken cancellationToken)
    {
        var formB = ApplicationMappings.ToFormB(formBFields);

        await AddPermissions(formB, formBFields, cancellationToken);
        await AddFormBUgUnits(formB, formBFields, cancellationToken);
        await AddFormBGuestUnits(formB, formBFields, cancellationToken);
        await AddCrewMembers(formB, formBFields, cancellationToken);
        await AddFormBPorts(formB, formBFields, cancellationToken);
        await AddCruiseDaysDetails(formB, formBFields, cancellationToken);
        await AddShipEquipments(formB, formBFields, cancellationToken);

        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await AddFormBShortResearchEquipments(
            formB,
            formBFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormBLongResearchEquipments(
            formB,
            formBFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormBResearchEquipments(
            formB,
            formBFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );

        return formB;
    }

    private async Task AddPermissions(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionFields in formBFields.Permissions)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionFields,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            formB.Permissions.Add(permission);
        }
    }

    private async Task AddFormBUgUnits(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamFields in formBFields.UgTeams)
        {
            var ugUnit = await dbContext.UgUnits.FindAsync(
                [ugTeamFields.UgUnitId],
                cancellationToken
            );
            if (ugUnit is null)
                continue;

            var formBUgUnit = new FormBUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamFields.NoOfEmployees,
                NoOfStudents = ugTeamFields.NoOfStudents,
            };
            formB.FormBUgUnits.Add(formBUgUnit);
        }
    }

    private async Task AddFormBGuestUnits(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamFields in formBFields.GuestTeams)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamFields,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            var formBGuestUnit = new FormBGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamFields.NoOfPersons,
            };
            formB.FormBGuestUnits.Add(formBGuestUnit);
        }
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

    private async Task AddFormBShortResearchEquipments(
        FormB formB,
        FormBFields formBFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var shortTermEquipmentFields in formBFields.ShortResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                shortTermEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formBShortResearchEquipment = new FormBShortResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                StartDate = shortTermEquipmentFields.StartDate,
                EndDate = shortTermEquipmentFields.EndDate,
            };
            formB.FormBShortResearchEquipments.Add(formBShortResearchEquipment);
        }
    }

    private async Task AddFormBLongResearchEquipments(
        FormB formB,
        FormBFields formBFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var longTermEquipmentFields in formBFields.LongResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                longTermEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formBLongResearchEquipment = new FormBLongResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                Action = longTermEquipmentFields.Action.ToEnum<ResearchEquipmentAction>(),
                Duration = longTermEquipmentFields.Duration,
            };
            formB.FormBLongResearchEquipments.Add(formBLongResearchEquipment);
        }
    }

    private async Task AddFormBPorts(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPorts = new HashSet<Port>();

        foreach (var portCallFields in formBFields.Ports)
        {
            var port = await formsFieldsService.GetUniquePort(
                portCallFields,
                alreadyAddedPorts,
                cancellationToken
            );
            alreadyAddedPorts.Add(port);

            var formBPort = new FormBPort
            {
                Port = port,
                StartTime = portCallFields.StartTime,
                EndTime = portCallFields.EndTime,
            };
            formB.FormBPorts.Add(formBPort);
        }
    }

    private async Task AddCruiseDaysDetails(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedCruiseDaysDetails = new HashSet<CruiseDayDetails>();

        foreach (var cruiseDayFields in formBFields.CruiseDaysDetails)
        {
            var cruiseDayDetails = await formsFieldsService.GetUniqueCruiseDayDetails(
                cruiseDayFields,
                alreadyAddedCruiseDaysDetails,
                cancellationToken
            );
            alreadyAddedCruiseDaysDetails.Add(cruiseDayDetails);

            formB.CruiseDaysDetails.Add(cruiseDayDetails);
        }
    }

    private async Task AddFormBResearchEquipments(
        FormB formB,
        FormBFields formBFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var researchEquipmentFields in formBFields.ResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                researchEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formBResearchEquipment = new FormBResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                InsuranceStartDate = researchEquipmentFields.InsuranceStartDate,
                InsuranceEndDate = researchEquipmentFields.InsuranceEndDate,
                Permission = researchEquipmentFields.Permission,
            };
            formB.FormBResearchEquipments.Add(formBResearchEquipment);
        }
    }

    private async Task AddShipEquipments(
        FormB formB,
        FormBFields formBFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var shipEquipmentId in formBFields.ShipEquipmentsIds)
        {
            var shipEquipment = await dbContext.ShipEquipments.FindAsync(
                [shipEquipmentId],
                cancellationToken
            );
            if (shipEquipment is null)
                continue;

            formB.ShipEquipments.Add(shipEquipment);
        }
    }
}
