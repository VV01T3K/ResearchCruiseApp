using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal class FormCFactory(
    FormBCFieldsWriter formFieldsWriter,
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

        await formFieldsWriter.AddPermissions(
            formC.Permissions,
            formCFields.Permissions,
            cancellationToken
        );
        await AddResearchAreaDescriptions(formC, formCFields, cancellationToken);
        await formFieldsWriter.AddUgUnits(
            formC.FormCUgUnits,
            formCFields.UgTeams,
            (ugUnit, ugTeamFields) =>
                new FormCUgUnit
                {
                    UgUnit = ugUnit,
                    NoOfEmployees = ugTeamFields.NoOfEmployees,
                    NoOfStudents = ugTeamFields.NoOfStudents,
                },
            cancellationToken
        );
        await formFieldsWriter.AddGuestUnits(
            formC.FormCGuestUnits,
            formCFields.GuestTeams,
            (guestUnit, guestTeamFields) =>
                new FormCGuestUnit
                {
                    GuestUnit = guestUnit,
                    NoOfPersons = guestTeamFields.NoOfPersons,
                },
            cancellationToken
        );
        await effectsService.AddResearchTasksEffects(
            formC,
            formCFields.ResearchTasksEffects,
            cancellationToken
        );
        await AddContracts(formC, formCFields, cancellationToken);
        await AddFormCSpubTasks(formC, formCFields, cancellationToken);
        await formFieldsWriter.AddPorts(
            formC.FormCPorts,
            formCFields.Ports,
            (port, portCallFields) =>
                new FormCPort
                {
                    Port = port,
                    StartTime = portCallFields.StartTime,
                    EndTime = portCallFields.EndTime,
                },
            cancellationToken
        );
        await formFieldsWriter.AddCruiseDaysDetails(
            formC.CruiseDaysDetails,
            formCFields.CruiseDaysDetails,
            cancellationToken
        );
        await formFieldsWriter.AddShipEquipments(
            formC.ShipEquipments,
            formCFields.ShipEquipmentsIds,
            cancellationToken
        );
        await AddPhotos(formC, formCFields, cancellationToken);

        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await formFieldsWriter.AddResearchEquipments(
            formC.FormCShortResearchEquipments,
            formCFields.ShortResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, shortTermEquipmentFields) =>
                new FormCShortResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    StartDate = shortTermEquipmentFields.StartDate,
                    EndDate = shortTermEquipmentFields.EndDate,
                },
            cancellationToken
        );
        await formFieldsWriter.AddResearchEquipments(
            formC.FormCLongResearchEquipments,
            formCFields.LongResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, longTermEquipmentFields) =>
                new FormCLongResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    Action = longTermEquipmentFields.Action.ToEnum<ResearchEquipmentAction>(),
                    Duration = longTermEquipmentFields.Duration,
                },
            cancellationToken
        );
        await formFieldsWriter.AddResearchEquipments(
            formC.FormCResearchEquipments,
            formCFields.ResearchEquipments,
            alreadyAddedResearchEquipments,
            (researchEquipment, researchEquipmentFields) =>
                new FormCResearchEquipment
                {
                    ResearchEquipment = researchEquipment,
                    InsuranceStartDate = researchEquipmentFields.InsuranceStartDate,
                    InsuranceEndDate = researchEquipmentFields.InsuranceEndDate,
                    Permission = researchEquipmentFields.Permission,
                },
            cancellationToken
        );

        return formC;
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
