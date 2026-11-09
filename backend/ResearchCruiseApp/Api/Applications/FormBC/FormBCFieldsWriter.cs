using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

internal class FormBCFieldsWriter(
    ApplicationDbContext dbContext,
    UniqueFormFieldResolver formsFieldsService
)
{
    public async Task AddPermissions(
        List<Permission> permissions,
        List<PermissionFields> permissionsFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionFields in permissionsFields)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionFields,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            permissions.Add(permission);
        }
    }

    public async Task AddUgUnits<TFormUgUnit>(
        List<TFormUgUnit> formUgUnits,
        List<UgTeamFields> ugTeamsFields,
        Func<UgUnit, UgTeamFields, TFormUgUnit> createFormUgUnit,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamFields in ugTeamsFields)
        {
            var ugUnit = await dbContext.UgUnits.FindAsync(
                [ugTeamFields.UgUnitId],
                cancellationToken
            );
            if (ugUnit is null)
                continue;

            formUgUnits.Add(createFormUgUnit(ugUnit, ugTeamFields));
        }
    }

    public async Task AddGuestUnits<TFormGuestUnit>(
        List<TFormGuestUnit> formGuestUnits,
        List<GuestTeamFields> guestTeamsFields,
        Func<GuestUnit, GuestTeamFields, TFormGuestUnit> createFormGuestUnit,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamFields in guestTeamsFields)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamFields,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            formGuestUnits.Add(createFormGuestUnit(guestUnit, guestTeamFields));
        }
    }

    public async Task AddPorts<TFormPort>(
        List<TFormPort> formPorts,
        List<PortCallFields> portCallsFields,
        Func<Port, PortCallFields, TFormPort> createFormPort,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPorts = new HashSet<Port>();

        foreach (var portCallFields in portCallsFields)
        {
            var port = await formsFieldsService.GetUniquePort(
                portCallFields,
                alreadyAddedPorts,
                cancellationToken
            );
            alreadyAddedPorts.Add(port);

            formPorts.Add(createFormPort(port, portCallFields));
        }
    }

    public async Task AddCruiseDaysDetails(
        List<CruiseDayDetails> cruiseDaysDetails,
        List<CruiseDayFields> cruiseDaysFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedCruiseDaysDetails = new HashSet<CruiseDayDetails>();

        foreach (var cruiseDayFields in cruiseDaysFields)
        {
            var cruiseDayDetails = await formsFieldsService.GetUniqueCruiseDayDetails(
                cruiseDayFields,
                alreadyAddedCruiseDaysDetails,
                cancellationToken
            );
            alreadyAddedCruiseDaysDetails.Add(cruiseDayDetails);

            cruiseDaysDetails.Add(cruiseDayDetails);
        }
    }

    public async Task AddShipEquipments(
        List<ShipEquipment> shipEquipments,
        List<Guid> shipEquipmentsIds,
        CancellationToken cancellationToken
    )
    {
        foreach (var shipEquipmentId in shipEquipmentsIds)
        {
            var shipEquipment = await dbContext.ShipEquipments.FindAsync(
                [shipEquipmentId],
                cancellationToken
            );
            if (shipEquipment is null)
                continue;

            shipEquipments.Add(shipEquipment);
        }
    }

    public async Task AddResearchEquipments<TFields, TFormResearchEquipment>(
        List<TFormResearchEquipment> formResearchEquipments,
        List<TFields> researchEquipmentsFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        Func<ResearchEquipment, TFields, TFormResearchEquipment> createFormResearchEquipment,
        CancellationToken cancellationToken
    )
        where TFields : IResearchEquipmentFields
    {
        foreach (var researchEquipmentFields in researchEquipmentsFields)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                researchEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            formResearchEquipments.Add(
                createFormResearchEquipment(researchEquipment, researchEquipmentFields)
            );
        }
    }
}
