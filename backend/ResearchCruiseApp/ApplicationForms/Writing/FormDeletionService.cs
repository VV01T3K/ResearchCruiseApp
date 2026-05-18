using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.ApplicationForms.Writing;

internal class FormDeletionService(
    CruiseEffectService effectsService,
    ApplicationDbContext dbContext
)
{
    public async Task DeleteFormA(FormA formA, CancellationToken cancellationToken)
    {
        await DeletePermissions(formA, cancellationToken);
        await DeleteFormAResearchTasks(formA, cancellationToken);
        await DeleteFormAContracts(formA, cancellationToken);
        await DeleteFormAResearchAreaDescriptions(formA, cancellationToken);
        DeleteFormAUgUnits(formA);
        await DeleteFormAGuestUnits(formA, cancellationToken);
        await DeleteFormAPublications(formA, cancellationToken);
        await DeleteFormASpubTasks(formA, cancellationToken);

        dbContext.FormsA.Remove(formA);
    }

    public async Task DeleteFormB(FormB formB, CancellationToken cancellationToken)
    {
        await DeletePermissions(formB, cancellationToken);
        DeleteFormBUgUnits(formB);
        await DeleteFormBGuestUnits(formB, cancellationToken);
        await DeleteCrewMembers(formB, cancellationToken);
        await DeleteFormBShortResearchEquipments(formB, cancellationToken);
        await DeleteFormBLongResearchEquipments(formB, cancellationToken);
        await DeletePorts(formB, cancellationToken);
        await DeleteCruiseDaysDetails(formB, cancellationToken);
        await DeleteFormBResearchEquipments(formB, cancellationToken);
        RemoveShipEquipments(formB);

        dbContext.FormsB.Remove(formB);
    }

    public async Task DeleteFormC(FormC formC, CancellationToken cancellationToken)
    {
        await DeletePermissions(formC, cancellationToken);
        DeleteFormCUgUnits(formC);
        await DeleteFormCGuestUnits(formC, cancellationToken);
        await effectsService.DeleteResearchTasksEffects(formC, cancellationToken);
        await DeleteContracts(formC, cancellationToken);
        await DeleteFormCResearchAreaDescriptions(formC, cancellationToken);
        await DeleteSpubTasks(formC, cancellationToken);
        await DeleteFormCShortResearchEquipments(formC, cancellationToken);
        await DeleteFormCLongResearchEquipments(formC, cancellationToken);
        await DeletePorts(formC, cancellationToken);
        await DeleteCruiseDaysDetails(formC, cancellationToken);
        await DeleteFormCResearchEquipments(formC, cancellationToken);
        RemoveShipEquipments(formC);
        DeleteCollectedSamples(formC);
        DeletePhotos(formC);

        dbContext.FormsC.Remove(formC);
    }

    private async Task DeletePermissions(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var permission in formA.Permissions)
        {
            if (
                await CountFormsA(permission, cancellationToken) == 1
                && // The one to be deleted
                await CountFormsB(permission, cancellationToken) == 0
                && await CountFormsC(permission, cancellationToken) == 0
            )
            {
                dbContext.Permissions.Remove(permission);
            }
        }

        formA.Permissions.Clear();
    }

    private async Task DeleteFormAResearchTasks(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAResearchTask in formA.FormAResearchTasks)
        {
            var researchTask = formAResearchTask.ResearchTask;
            dbContext.FormAResearchTasks.Remove(formAResearchTask);

            if (
                await CountUniqueFormsA(researchTask, cancellationToken) == 1
                && // The one to ne deleted
                await CountResearchTaskEffects(researchTask, cancellationToken) == 0
            )
            {
                dbContext.ResearchTasks.Remove(researchTask);
            }
        }
    }

    private async Task DeleteFormAContracts(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAContract in formA.FormAContracts)
        {
            var contract = formAContract.Contract;
            dbContext.Set<FormAContract>().Remove(formAContract);

            if (
                await CountDistinctFormsA(contract, cancellationToken) == 1
                && // The one to be deleted
                await CountDistinctFormsC(contract, cancellationToken) == 0
            )
            {
                dbContext.Contracts.Remove(contract);
            }
        }
    }

    private async Task DeleteFormAResearchAreaDescriptions(
        FormA formA,
        CancellationToken cancellationToken
    )
    {
        foreach (var researchAreaDescription in formA.ResearchAreaDescriptions)
        {
            if (
                await CountFormsA(researchAreaDescription, cancellationToken) == 1
                && await CountFormsC(researchAreaDescription, cancellationToken) == 0
            )
            {
                dbContext.ResearchAreaDescriptions.Remove(researchAreaDescription);
            }
        }

        formA.ResearchAreaDescriptions.Clear();
    }

    private void DeleteFormAUgUnits(FormA formA)
    {
        foreach (var formAUgUnit in formA.FormAUgUnits)
        {
            dbContext.FormAUgUnits.Remove(formAUgUnit);
        }
    }

    private async Task DeleteFormAGuestUnits(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAGuestUnit in formA.FormAGuestUnits)
        {
            var guestUnit = formAGuestUnit.GuestUnit;
            dbContext.FormAGuestUnits.Remove(formAGuestUnit);

            if (
                await CountUniqueFormsA(guestUnit, cancellationToken) == 1
                && // The one to be deleted
                await CountFormBGuestUnits(guestUnit, cancellationToken) == 0
                && await CountFormCGuestUnits(guestUnit, cancellationToken) == 0
            )
            {
                dbContext.GuestUnits.Remove(guestUnit);
            }
        }
    }

    private async Task DeleteFormAPublications(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAPublication in formA.FormAPublications)
        {
            var publication = formAPublication.Publication;
            dbContext.FormAPublications.Remove(formAPublication);

            if (
                await CountUniqueFormsA(publication, cancellationToken) == 1
                && // The one to be deleted
                await CountUserPublications(publication, cancellationToken) == 0
            )
            {
                dbContext.Publications.Remove(publication);
            }
        }
    }

    private async Task DeleteFormASpubTasks(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formASpubTask in formA.FormASpubTasks)
        {
            var spubTask = formASpubTask.SpubTask;
            dbContext.FormASpubTasks.Remove(formASpubTask);

            if (
                await CountUniqueFormsA(spubTask, cancellationToken) == 1
                && // The one to be deleted
                await CountUniqueFormsC(spubTask, cancellationToken) == 0
            )
            {
                dbContext.SpubTasks.Remove(spubTask);
            }
        }
    }

    private async Task DeletePermissions(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var permission in formB.Permissions)
        {
            if (
                await CountFormsA(permission, cancellationToken) == 0
                && await CountFormsB(permission, cancellationToken) == 1
                && // The one to be deleted
                await CountFormsC(permission, cancellationToken) == 0
            )
            {
                dbContext.Permissions.Remove(permission);
            }
        }

        formB.Permissions.Clear();
    }

    private void DeleteFormBUgUnits(FormB formB)
    {
        foreach (var formBUgUnit in formB.FormBUgUnits)
        {
            dbContext.FormBUgUnits.Remove(formBUgUnit);
        }
    }

    private async Task DeleteFormBGuestUnits(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBGuestUnit in formB.FormBGuestUnits)
        {
            var guestUnit = formBGuestUnit.GuestUnit;
            dbContext.FormBGuestUnits.Remove(formBGuestUnit);

            if (
                await CountFormAGuestUnits(guestUnit, cancellationToken) == 0
                && await CountUniqueFormsB(guestUnit, cancellationToken) == 1
                && // The one to be deleted
                await CountFormCGuestUnits(guestUnit, cancellationToken) == 0
            )
            {
                dbContext.GuestUnits.Remove(guestUnit);
            }
        }
    }

    private async Task DeleteCrewMembers(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var crewMember in formB.CrewMembers)
        {
            if (await CountUniqueFormsB(crewMember, cancellationToken) == 1) // The one to be deleted
                dbContext.CrewMembers.Remove(crewMember);
        }

        formB.CrewMembers.Clear();
    }

    private async Task DeleteFormBShortResearchEquipments(
        FormB formB,
        CancellationToken cancellationToken
    )
    {
        foreach (var formBShortResearchEquipment in formB.FormBShortResearchEquipments)
        {
            var researchEquipment = formBShortResearchEquipment.ResearchEquipment;
            dbContext.FormBShortResearchEquipments.Remove(formBShortResearchEquipment);

            if (
                await CountFormCAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsB(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private async Task DeleteFormBLongResearchEquipments(
        FormB formB,
        CancellationToken cancellationToken
    )
    {
        foreach (var formBLongResearchEquipment in formB.FormBLongResearchEquipments)
        {
            var researchEquipment = formBLongResearchEquipment.ResearchEquipment;
            dbContext.FormBLongResearchEquipments.Remove(formBLongResearchEquipment);

            if (
                await CountFormCAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsB(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private async Task DeletePorts(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBPort in formB.FormBPorts)
        {
            var port = formBPort.Port;
            dbContext.FormBPorts.Remove(formBPort);

            if (
                await CountFormCPorts(port, cancellationToken) == 0
                && await CountUniqueFormsB(port, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.Ports.Remove(port);
            }
        }
    }

    private async Task DeleteCruiseDaysDetails(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var cruiseDayDetails in formB.CruiseDaysDetails)
        {
            if (
                await CountUniqueFormsC(cruiseDayDetails, cancellationToken) == 0
                && await CountUniqueFormsB(cruiseDayDetails, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.CruiseDaysDetails.Remove(cruiseDayDetails);
            }
        }

        formB.CruiseDaysDetails.Clear();
    }

    private async Task DeleteFormBResearchEquipments(
        FormB formB,
        CancellationToken cancellationToken
    )
    {
        foreach (var formBResearchEquipment in formB.FormBResearchEquipments)
        {
            var researchEquipment = formBResearchEquipment.ResearchEquipment;
            dbContext.FormBResearchEquipments.Remove(formBResearchEquipment);

            if (
                await CountFormCAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsB(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private static void RemoveShipEquipments(FormB formB)
    {
        formB.ShipEquipments.Clear();
    }

    private async Task DeletePermissions(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var permission in formC.Permissions)
        {
            if (
                await CountFormsA(permission, cancellationToken) == 0
                && await CountFormsB(permission, cancellationToken) == 0
                && await CountFormsC(permission, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.Permissions.Remove(permission);
            }
        }

        formC.Permissions.Clear();
    }

    private void DeleteFormCUgUnits(FormC formC)
    {
        foreach (var formCUgUnit in formC.FormCUgUnits)
        {
            dbContext.FormCUgUnits.Remove(formCUgUnit);
        }
    }

    private async Task DeleteFormCGuestUnits(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCGuestUnit in formC.FormCGuestUnits)
        {
            var guestUnit = formCGuestUnit.GuestUnit;
            dbContext.FormGuestUnits.Remove(formCGuestUnit);

            if (
                await CountFormAGuestUnits(guestUnit, cancellationToken) == 0
                && await CountFormBGuestUnits(guestUnit, cancellationToken) == 0
                && await CountUniqueFormsC(guestUnit, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.GuestUnits.Remove(guestUnit);
            }
        }
    }

    private async Task DeleteContracts(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var contract in formC.Contracts)
        {
            if (
                await CountFormAContracts(contract, cancellationToken) == 0
                && await CountDistinctFormsC(contract, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.Contracts.Remove(contract);
            }
        }

        formC.Contracts.Clear();
    }

    private async Task DeleteFormCResearchAreaDescriptions(
        FormC formC,
        CancellationToken cancellationToken
    )
    {
        foreach (var researchAreaDescription in formC.ResearchAreaDescriptions)
        {
            if (
                await CountFormsC(researchAreaDescription, cancellationToken) == 1
                && await CountFormsA(researchAreaDescription, cancellationToken) == 0
            )
            {
                dbContext.ResearchAreaDescriptions.Remove(researchAreaDescription);
            }
        }

        formC.ResearchAreaDescriptions.Clear();
    }

    private async Task DeleteSpubTasks(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var spubTask in formC.SpubTasks)
        {
            if (
                await CountFormASpubTasks(spubTask, cancellationToken) == 0
                && await CountUniqueFormsC(spubTask, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.SpubTasks.Remove(spubTask);
            }
        }

        formC.SpubTasks.Clear();
    }

    private async Task DeleteFormCShortResearchEquipments(
        FormC formC,
        CancellationToken cancellationToken
    )
    {
        foreach (var formCShortResearchEquipment in formC.FormCShortResearchEquipments)
        {
            var researchEquipment = formCShortResearchEquipment.ResearchEquipment;
            dbContext.FormCShortResearchEquipments.Remove(formCShortResearchEquipment);

            if (
                await CountFormBAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsC(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private async Task DeleteFormCLongResearchEquipments(
        FormC formC,
        CancellationToken cancellationToken
    )
    {
        foreach (var formCLongResearchEquipment in formC.FormCLongResearchEquipments)
        {
            var researchEquipment = formCLongResearchEquipment.ResearchEquipment;
            dbContext.FormCLongResearchEquipments.Remove(formCLongResearchEquipment);

            if (
                await CountFormBAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsC(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private async Task DeletePorts(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCPort in formC.FormCPorts)
        {
            var port = formCPort.Port;
            dbContext.FormCPorts.Remove(formCPort);

            if (
                await CountFormBPorts(port, cancellationToken) == 0
                && await CountUniqueFormsC(port, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.Ports.Remove(port);
            }
        }
    }

    private async Task DeleteCruiseDaysDetails(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var cruiseDayDetails in formC.CruiseDaysDetails)
        {
            if (
                await CountUniqueFormsB(cruiseDayDetails, cancellationToken) == 0
                && await CountUniqueFormsC(cruiseDayDetails, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.CruiseDaysDetails.Remove(cruiseDayDetails);
            }
        }

        formC.CruiseDaysDetails.Clear();
    }

    private async Task DeleteFormCResearchEquipments(
        FormC formC,
        CancellationToken cancellationToken
    )
    {
        foreach (var formCResearchEquipment in formC.FormCResearchEquipments)
        {
            var researchEquipment = formCResearchEquipment.ResearchEquipment;
            dbContext.FormCResearchEquipments.Remove(formCResearchEquipment);

            if (
                await CountFormBAssociations(researchEquipment, cancellationToken) == 0
                && await CountUniqueFormsC(researchEquipment, cancellationToken) == 1
            ) // The one to be deleted
            {
                dbContext.ResearchEquipments.Remove(researchEquipment);
            }
        }
    }

    private static void RemoveShipEquipments(FormC formC)
    {
        formC.ShipEquipments.Clear();
    }

    private void DeleteCollectedSamples(FormC formC)
    {
        foreach (var collectedSample in formC.CollectedSamples)
        {
            dbContext.CollectedSamples.Remove(collectedSample);
        }

        formC.CollectedSamples.Clear();
    }

    private void DeletePhotos(FormC formC)
    {
        foreach (var photo in formC.Photos)
        {
            dbContext.Photos.Remove(photo);
        }

        formC.Photos.Clear();
    }

    private Task<int> CountFormsA(Permission permission, CancellationToken cancellationToken) =>
        dbContext
            .Permissions.Where(candidate => candidate.Id == permission.Id)
            .SelectMany(candidate => candidate.FormsA)
            .CountAsync(cancellationToken);

    private Task<int> CountFormsB(Permission permission, CancellationToken cancellationToken) =>
        dbContext
            .Permissions.Where(candidate => candidate.Id == permission.Id)
            .SelectMany(candidate => candidate.FormsB)
            .CountAsync(cancellationToken);

    private Task<int> CountFormsC(Permission permission, CancellationToken cancellationToken) =>
        dbContext
            .Permissions.Where(candidate => candidate.Id == permission.Id)
            .SelectMany(candidate => candidate.FormsC)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsA(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .ResearchTasks.Where(candidate => candidate.Id == researchTask.Id)
            .SelectMany(candidate => candidate.FormAResearchTasks)
            .Select(join => join.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountResearchTaskEffects(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .ResearchTasks.Where(candidate => candidate.Id == researchTask.Id)
            .SelectMany(candidate => candidate.ResearchTasksEffects)
            .CountAsync(cancellationToken);

    private Task<int> CountDistinctFormsA(Contract contract, CancellationToken cancellationToken) =>
        dbContext
            .Contracts.Where(candidate => candidate.Id == contract.Id)
            .SelectMany(candidate => candidate.FormAContracts)
            .Select(join => join.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountDistinctFormsC(Contract contract, CancellationToken cancellationToken) =>
        dbContext
            .Contracts.Where(candidate => candidate.Id == contract.Id)
            .SelectMany(candidate => candidate.FormsC)
            .Select(form => form.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountFormAContracts(Contract contract, CancellationToken cancellationToken) =>
        dbContext
            .Contracts.Where(candidate => candidate.Id == contract.Id)
            .SelectMany(candidate => candidate.FormAContracts)
            .CountAsync(cancellationToken);

    private Task<int> CountFormsA(
        ResearchAreaDescription description,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .ResearchAreaDescriptions.Where(candidate => candidate.Id == description.Id)
            .SelectMany(candidate => candidate.FormsA)
            .CountAsync(cancellationToken);

    private Task<int> CountFormsC(
        ResearchAreaDescription description,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .ResearchAreaDescriptions.Where(candidate => candidate.Id == description.Id)
            .SelectMany(candidate => candidate.FormsC)
            .CountAsync(cancellationToken);

    private Task<int> CountFormAGuestUnits(
        GuestUnit guestUnit,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormAGuestUnits)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsA(GuestUnit guestUnit, CancellationToken cancellationToken) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormAGuestUnits)
            .Select(join => join.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountFormBGuestUnits(
        GuestUnit guestUnit,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormBGuestUnits)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsB(GuestUnit guestUnit, CancellationToken cancellationToken) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormBGuestUnits)
            .Select(join => join.FormB.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountFormCGuestUnits(
        GuestUnit guestUnit,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormCGuestUnits)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsC(GuestUnit guestUnit, CancellationToken cancellationToken) =>
        dbContext
            .GuestUnits.Where(candidate => candidate.Id == guestUnit.Id)
            .SelectMany(candidate => candidate.FormCGuestUnits)
            .Select(join => join.FormC.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsA(
        Publication publication,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .Publications.Where(candidate => candidate.Id == publication.Id)
            .SelectMany(candidate => candidate.FormAPublications)
            .Select(join => join.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUserPublications(
        Publication publication,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .Publications.Where(candidate => candidate.Id == publication.Id)
            .SelectMany(candidate => candidate.UserPublications)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsA(SpubTask spubTask, CancellationToken cancellationToken) =>
        dbContext
            .SpubTasks.Where(candidate => candidate.Id == spubTask.Id)
            .SelectMany(candidate => candidate.FormASpubTasks)
            .Select(join => join.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsC(SpubTask spubTask, CancellationToken cancellationToken) =>
        dbContext
            .SpubTasks.Where(candidate => candidate.Id == spubTask.Id)
            .SelectMany(candidate => candidate.FormsC)
            .Select(form => form.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountFormASpubTasks(SpubTask spubTask, CancellationToken cancellationToken) =>
        dbContext
            .SpubTasks.Where(candidate => candidate.Id == spubTask.Id)
            .SelectMany(candidate => candidate.FormASpubTasks)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsB(
        CrewMember crewMember,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .CrewMembers.Where(candidate => candidate.Id == crewMember.Id)
            .SelectMany(candidate => candidate.FormsB)
            .Select(form => form.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private async Task<int> CountFormBAssociations(
        ResearchEquipment equipment,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext.ResearchEquipments.Where(candidate => candidate.Id == equipment.Id);
        return await query
                .SelectMany(candidate => candidate.FormBShortResearchEquipments)
                .CountAsync(cancellationToken)
            + await query
                .SelectMany(candidate => candidate.FormBLongResearchEquipments)
                .CountAsync(cancellationToken)
            + await query
                .SelectMany(candidate => candidate.FormBResearchEquipments)
                .CountAsync(cancellationToken);
    }

    private async Task<int> CountFormCAssociations(
        ResearchEquipment equipment,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext.ResearchEquipments.Where(candidate => candidate.Id == equipment.Id);
        return await query
                .SelectMany(candidate => candidate.FormCShortResearchEquipments)
                .CountAsync(cancellationToken)
            + await query
                .SelectMany(candidate => candidate.FormCLongResearchEquipments)
                .CountAsync(cancellationToken)
            + await query
                .SelectMany(candidate => candidate.FormCResearchEquipments)
                .CountAsync(cancellationToken);
    }

    private Task<int> CountUniqueFormsB(
        ResearchEquipment equipment,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext.ResearchEquipments.Where(candidate => candidate.Id == equipment.Id);
        return query
            .SelectMany(candidate => candidate.FormBShortResearchEquipments)
            .Select(join => join.FormB.Id)
            .Union(
                query
                    .SelectMany(candidate => candidate.FormBLongResearchEquipments)
                    .Select(join => join.FormB.Id)
            )
            .Union(
                query
                    .SelectMany(candidate => candidate.FormBResearchEquipments)
                    .Select(join => join.FormB.Id)
            )
            .CountAsync(cancellationToken);
    }

    private Task<int> CountUniqueFormsC(
        ResearchEquipment equipment,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext.ResearchEquipments.Where(candidate => candidate.Id == equipment.Id);
        return query
            .SelectMany(candidate => candidate.FormCShortResearchEquipments)
            .Select(join => join.FormC.Id)
            .Union(
                query
                    .SelectMany(candidate => candidate.FormCLongResearchEquipments)
                    .Select(join => join.FormC.Id)
            )
            .Union(
                query
                    .SelectMany(candidate => candidate.FormCResearchEquipments)
                    .Select(join => join.FormC.Id)
            )
            .CountAsync(cancellationToken);
    }

    private Task<int> CountFormBPorts(Port port, CancellationToken cancellationToken) =>
        dbContext
            .Ports.Where(candidate => candidate.Id == port.Id)
            .SelectMany(candidate => candidate.FormBPorts)
            .CountAsync(cancellationToken);

    private Task<int> CountFormCPorts(Port port, CancellationToken cancellationToken) =>
        dbContext
            .Ports.Where(candidate => candidate.Id == port.Id)
            .SelectMany(candidate => candidate.FormCPorts)
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsB(Port port, CancellationToken cancellationToken) =>
        dbContext
            .Ports.Where(candidate => candidate.Id == port.Id)
            .SelectMany(candidate => candidate.FormBPorts)
            .Select(join => join.FormB.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsC(Port port, CancellationToken cancellationToken) =>
        dbContext
            .Ports.Where(candidate => candidate.Id == port.Id)
            .SelectMany(candidate => candidate.FormCPorts)
            .Select(join => join.FormC.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsB(
        CruiseDayDetails cruiseDayDetails,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .CruiseDaysDetails.Where(candidate => candidate.Id == cruiseDayDetails.Id)
            .SelectMany(candidate => candidate.FormsB)
            .Select(form => form.Id)
            .Distinct()
            .CountAsync(cancellationToken);

    private Task<int> CountUniqueFormsC(
        CruiseDayDetails cruiseDayDetails,
        CancellationToken cancellationToken
    ) =>
        dbContext
            .CruiseDaysDetails.Where(candidate => candidate.Id == cruiseDayDetails.Id)
            .SelectMany(candidate => candidate.FormsC)
            .Select(form => form.Id)
            .Distinct()
            .CountAsync(cancellationToken);
}
