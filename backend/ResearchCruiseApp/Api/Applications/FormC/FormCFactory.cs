using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

internal class FormCFactory(
    ApplicationDbContext dbContext,
    UniqueFormFieldResolver formsFieldsService,
    CruiseEffectService effectsService,
    Compressor compressor
)
{
    public async Task<Result<FormC>> Create(
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var formC = ApplicationMappings.ToFormC(formCFields);

        await AddPermissions(formC, formCFields, cancellationToken);
        await AddResearchAreaDescriptions(formC, formCFields, cancellationToken);
        await AddFormCUgUnits(formC, formCFields, cancellationToken);
        await AddFormCGuestUnits(formC, formCFields, cancellationToken);
        await effectsService.AddResearchTasksEffects(
            formC,
            formCFields.ResearchTasksEffects,
            cancellationToken
        );
        await AddContracts(formC, formCFields, cancellationToken);
        await AddFormCSpubTasks(formC, formCFields, cancellationToken);
        await AddFormCPorts(formC, formCFields, cancellationToken);
        await AddCruiseDaysDetails(formC, formCFields, cancellationToken);
        await AddShipEquipments(formC, formCFields, cancellationToken);
        await AddPhotos(formC, formCFields, cancellationToken);

        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await AddFormCShortResearchEquipments(
            formC,
            formCFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormCLongResearchEquipments(
            formC,
            formCFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormCResearchEquipments(
            formC,
            formCFields,
            alreadyAddedResearchEquipments,
            cancellationToken
        );

        return formC;
    }

    private async Task AddPermissions(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionFields in formCFields.Permissions)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionFields,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            formC.Permissions.Add(permission);
        }
    }

    private async Task AddResearchAreaDescriptions(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchAreaDescriptions = new HashSet<ResearchAreaDescription>();

        foreach (var researchAreaSelection in formCFields.ResearchAreaDescriptions)
        {
            var researchAreaDescription = await formsFieldsService.GetUniqueResearchAreaDescription(
                researchAreaSelection,
                alreadyAddedResearchAreaDescriptions,
                cancellationToken
            );
            alreadyAddedResearchAreaDescriptions.Add(researchAreaDescription);

            formC.ResearchAreaDescriptions.Add(researchAreaDescription);
        }
    }

    private async Task AddFormCUgUnits(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamFields in formCFields.UgTeams)
        {
            var ugUnit = await dbContext.UgUnits.FindAsync(
                [ugTeamFields.UgUnitId],
                cancellationToken
            );
            if (ugUnit is null)
                continue;

            var formCUgUnit = new FormCUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamFields.NoOfEmployees,
                NoOfStudents = ugTeamFields.NoOfStudents,
            };
            formC.FormCUgUnits.Add(formCUgUnit);
        }
    }

    private async Task AddFormCGuestUnits(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamFields in formCFields.GuestTeams)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamFields,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            var formCGuestUnit = new FormCGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamFields.NoOfPersons,
            };
            formC.FormCGuestUnits.Add(formCGuestUnit);
        }
    }

    private async Task AddContracts(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedContracts = new HashSet<Contract>();

        foreach (var contractFields in formCFields.Contracts)
        {
            var contract = await formsFieldsService.GetUniqueContract(
                contractFields,
                alreadyAddedContracts,
                cancellationToken
            );
            alreadyAddedContracts.Add(contract);

            formC.Contracts.Add(contract);
        }
    }

    private async Task AddFormCSpubTasks(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedSpubTasks = new HashSet<SpubTask>();

        foreach (var spubTaskFields in formCFields.SpubTasks)
        {
            var spubTask = await formsFieldsService.GetUniqueSpubTask(
                spubTaskFields,
                alreadyAddedSpubTasks,
                cancellationToken
            );
            alreadyAddedSpubTasks.Add(spubTask);

            formC.SpubTasks.Add(spubTask);
        }
    }

    private async Task AddFormCShortResearchEquipments(
        FormC formC,
        FormCFields formCFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var shortTermEquipmentFields in formCFields.ShortResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                shortTermEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCShortResearchEquipment = new FormCShortResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                StartDate = shortTermEquipmentFields.StartDate,
                EndDate = shortTermEquipmentFields.EndDate,
            };
            formC.FormCShortResearchEquipments.Add(formCShortResearchEquipment);
        }
    }

    private async Task AddFormCLongResearchEquipments(
        FormC formC,
        FormCFields formCFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var longTermEquipmentFields in formCFields.LongResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                longTermEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCLongResearchEquipment = new FormCLongResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                Action = longTermEquipmentFields.Action.ToEnum<ResearchEquipmentAction>(),
                Duration = longTermEquipmentFields.Duration,
            };
            formC.FormCLongResearchEquipments.Add(formCLongResearchEquipment);
        }
    }

    private async Task AddFormCPorts(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPorts = new HashSet<Port>();

        foreach (var portCallFields in formCFields.Ports)
        {
            var port = await formsFieldsService.GetUniquePort(
                portCallFields,
                alreadyAddedPorts,
                cancellationToken
            );
            alreadyAddedPorts.Add(port);

            var formCPort = new FormCPort
            {
                Port = port,
                StartTime = portCallFields.StartTime,
                EndTime = portCallFields.EndTime,
            };
            formC.FormCPorts.Add(formCPort);
        }
    }

    private async Task AddCruiseDaysDetails(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedCruiseDaysDetails = new HashSet<CruiseDayDetails>();

        foreach (var cruiseDayFields in formCFields.CruiseDaysDetails)
        {
            var cruiseDayDetails = await formsFieldsService.GetUniqueCruiseDayDetails(
                cruiseDayFields,
                alreadyAddedCruiseDaysDetails,
                cancellationToken
            );
            alreadyAddedCruiseDaysDetails.Add(cruiseDayDetails);

            formC.CruiseDaysDetails.Add(cruiseDayDetails);
        }
    }

    private async Task AddFormCResearchEquipments(
        FormC formC,
        FormCFields formCFields,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var researchEquipmentFields in formCFields.ResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                researchEquipmentFields,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCResearchEquipment = new FormCResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                InsuranceStartDate = researchEquipmentFields.InsuranceStartDate,
                InsuranceEndDate = researchEquipmentFields.InsuranceEndDate,
                Permission = researchEquipmentFields.Permission,
            };
            formC.FormCResearchEquipments.Add(formCResearchEquipment);
        }
    }

    private async Task AddShipEquipments(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var shipEquipmentId in formCFields.ShipEquipmentsIds)
        {
            var shipEquipment = await dbContext.ShipEquipments.FindAsync(
                [shipEquipmentId],
                cancellationToken
            );
            if (shipEquipment is null)
                continue;

            formC.ShipEquipments.Add(shipEquipment);
        }
    }

    private async Task AddPhotos(
        FormC formC,
        FormCFields formCFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var photo in formCFields.Photos)
        {
            formC.Photos.Add(
                new Photo { Name = photo.Name, Content = await compressor.Compress(photo.Content) }
            );
        }
    }
}
