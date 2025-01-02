using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.FormsService;


public class FormsService(
    IEffectsService effectsService,
    IPermissionsRepository permissionsRepository,
    IFormAResearchTasksRepository formAResearchTasksRepository,
    IResearchTasksRepository researchTasksRepository,
    IFormAContractsRepository formAContractsRepository,
    IFormAUgUnitsRepository formAUgUnitsRepository,
    IFormAGuestUnitsRepository formAGuestUnitsRepository,
    IFormAPublicationsRepository formAPublicationsRepository,
    IPublicationsRepository publicationsRepository,
    IFormASpubTasksRepository formASpubTasksRepository,
    IFormBUgUnitsRepository formBUgUnitsRepository,
    IFormCUgUnitsRepository formCUgUnitsRepository,
    IFormBGuestUnitsRepository formBGuestUnitsRepository,
    IFormCGuestUnitsRepository formCGuestUnitsRepository,
    IGuestUnitsRepository guestUnitsRepository,
    ICrewMembersRepository crewMembersRepository,
    IFormBShortResearchEquipmentsRepository formBShortResearchEquipmentsRepository,
    IFormCShortResearchEquipmentsRepository formCShortResearchEquipmentsRepository,
    IResearchEquipmentsRepository researchEquipmentsRepository,
    IFormBLongResearchEquipmentsRepository formBLongResearchEquipmentsRepository,
    IFormCLongResearchEquipmentsRepository formCLongResearchEquipmentsRepository,
    IFormBPortsRepository formBPortsRepository,
    IFormCPortsRepository formCPortsRepository,
    IPortsRepository portsRepository,
    ICruiseDaysDetailsRepository cruiseDaysDetailsRepository,
    IFormBResearchEquipmentsRepository formBResearchEquipmentsRepository,
    IFormCResearchEquipmentsRepository formCResearchEquipmentsRepository,
    IContractsRepository contractsRepository,
    ISpubTasksRepository spubTasksRepository,
    ICollectedSamplesRepository collectedSamplesRepository,
    IPhotosRepository photosRepository,
    IFormsARepository formsARepository,
    IFormsBRepository formsBRepository,
    IFormsCRepository formsCRepository,
    IUnitOfWork unitOfWork)
    : IFormsService
{
    public async Task DeleteFormA(FormA formA, CancellationToken cancellationToken)
    {
        await DeletePermissions(formA, cancellationToken);
        await DeleteFormAResearchTasks(formA, cancellationToken);
        await DeleteFormAContracts(formA, cancellationToken);
        DeleteFormAUgUnits(formA);
        await DeleteFormAGuestUnits(formA, cancellationToken);
        await DeleteFormAPublications(formA, cancellationToken);
        await DeleteFormASpubTasks(formA, cancellationToken);
        
        formsARepository.Delete(formA);
        await unitOfWork.Complete(cancellationToken);
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
        
        formsBRepository.Delete(formB);
        await unitOfWork.Complete(cancellationToken);
    }

    public async Task DeleteFormC(FormC formC, CancellationToken cancellationToken)
    {
        await DeletePermissions(formC, cancellationToken);
        DeleteFormCUgUnits(formC);
        await DeleteFormCGuestUnits(formC, cancellationToken);
        await effectsService.DeleteResearchTasksEffects(formC, cancellationToken);
        await DeleteContracts(formC, cancellationToken);
        await DeleteSpubTasks(formC, cancellationToken);
        await DeleteFormCShortResearchEquipments(formC, cancellationToken);
        await DeleteFormCLongResearchEquipments(formC, cancellationToken);
        await DeletePorts(formC, cancellationToken);
        await DeleteCruiseDaysDetails(formC, cancellationToken);
        await DeleteFormCResearchEquipments(formC, cancellationToken);
        RemoveShipEquipments(formC);
        DeleteCollectedSamples(formC);
        DeletePhotos(formC);
        
        formsCRepository.Delete(formC);
        await unitOfWork.Complete(cancellationToken);
    }
    
    
    private async Task DeletePermissions(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var permission in formA.Permissions)
        {
            if (await permissionsRepository.CountFormsA(permission, cancellationToken) == 1 && // The one to be deleted
                await permissionsRepository.CountFormsB(permission, cancellationToken) == 0 &&
                await permissionsRepository.CountFormsC(permission, cancellationToken) == 0)
            {
                permissionsRepository.Delete(permission);
            }
        }
        
        formA.Permissions.Clear();
    }

    private async Task DeleteFormAResearchTasks(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAResearchTask in formA.FormAResearchTasks)
        {
            var researchTask = formAResearchTask.ResearchTask;
            formAResearchTasksRepository.Delete(formAResearchTask);

            if (await researchTasksRepository.CountUniqueFormsA(researchTask, cancellationToken) == 1 && // The one to ne deleted
                await researchTasksRepository.CountResearchTaskEffects(researchTask, cancellationToken) == 0)
            {
                researchTasksRepository.Delete(researchTask);
            }
        }
    }
    
    private async Task DeleteFormAContracts(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAContract in formA.FormAContracts)
        {
            var contract = formAContract.Contract;
            formAContractsRepository.Delete(formAContract);
            
            if (await contractsRepository.CountDistinctFormsA(contract, cancellationToken) == 1 && // The one to be deleted
                await contractsRepository.CountDistinctFormsC(contract, cancellationToken) == 0)
            {
                contractsRepository.Delete(contract);
            }
        }
    }
    
    private void DeleteFormAUgUnits(FormA formA)
    {
        foreach (var formAUgUnit in formA.FormAUgUnits)
        {
            formAUgUnitsRepository.Delete(formAUgUnit);
        }
    }
    
    private async Task DeleteFormAGuestUnits(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAGuestUnit in formA.FormAGuestUnits)
        {
            var guestUnit = formAGuestUnit.GuestUnit;
            formAGuestUnitsRepository.Delete(formAGuestUnit);
            
            if (await guestUnitsRepository.CountUniqueFormsA(guestUnit, cancellationToken) == 1 && // The one to be deleted
                await guestUnitsRepository.CountFormBGuestUnits(guestUnit, cancellationToken) == 0 &&
                await guestUnitsRepository.CountFormCGuestUnits(guestUnit, cancellationToken) == 0)
            {
                guestUnitsRepository.Delete(guestUnit);
            }
        }
    }

    private async Task DeleteFormAPublications(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formAPublication in formA.FormAPublications)
        {
            var publication = formAPublication.Publication;
            formAPublicationsRepository.Delete(formAPublication);

            if (await publicationsRepository.CountUniqueFormsA(publication, cancellationToken) == 1 && // The one to be deleted
                await publicationsRepository.CountUserPublications(publication, cancellationToken) == 0)
            {
                publicationsRepository.Delete(publication);
            }
        }
    }
    
    private async Task DeleteFormASpubTasks(FormA formA, CancellationToken cancellationToken)
    {
        foreach (var formASpubTask in formA.FormASpubTasks)
        {
            var spubTask = formASpubTask.SpubTask;
            formASpubTasksRepository.Delete(formASpubTask);
            
            if (await spubTasksRepository.CountUniqueFormsA(spubTask, cancellationToken) == 1 && // The one to be deleted
                await spubTasksRepository.CountUniqueFormsC(spubTask, cancellationToken) == 0)
            {
                spubTasksRepository.Delete(spubTask);
            }
        }
    }
    
    private async Task DeletePermissions(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var permission in formB.Permissions)
        {
            if (await permissionsRepository.CountFormsA(permission, cancellationToken) == 0 &&
                await permissionsRepository.CountFormsB(permission, cancellationToken) == 1 && // The one to be deleted
                await permissionsRepository.CountFormsC(permission, cancellationToken) == 0)
            {
                permissionsRepository.Delete(permission);
            }
        }
        
        formB.Permissions.Clear();
    }
    
    private void DeleteFormBUgUnits(FormB formB)
    {
        foreach (var formBUgUnit in formB.FormBUgUnits)
        {
            formBUgUnitsRepository.Delete(formBUgUnit);
        }
    }

    private async Task DeleteFormBGuestUnits(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBGuestUnit in formB.FormBGuestUnits)
        {
            var guestUnit = formBGuestUnit.GuestUnit;
            formBGuestUnitsRepository.Delete(formBGuestUnit);
            
            if (await guestUnitsRepository.CountFormAGuestUnits(guestUnit, cancellationToken) == 0 &&
                await guestUnitsRepository.CountUniqueFormsB(guestUnit, cancellationToken) == 1 && // The one to be deleted
                await guestUnitsRepository.CountFormCGuestUnits(guestUnit, cancellationToken) == 0)
            {
                guestUnitsRepository.Delete(guestUnit);
            }
        }
    }

    private async Task DeleteCrewMembers(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var crewMember in formB.CrewMembers)
        {
            if (await crewMembersRepository.CountUniqueFormsB(crewMember, cancellationToken) == 1) // The one to be deleted
                crewMembersRepository.Delete(crewMember);
        }
        
        formB.CrewMembers.Clear();
    }

    private async Task DeleteFormBShortResearchEquipments(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBShortResearchEquipment in formB.FormBShortResearchEquipments)
        {
            var researchEquipment = formBShortResearchEquipment.ResearchEquipment;
            formBShortResearchEquipmentsRepository.Delete(formBShortResearchEquipment);

            if (await researchEquipmentsRepository.CountFormCAssociations(researchEquipment, cancellationToken) == 0 && 
                await researchEquipmentsRepository.CountUniqueFormsB(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
            }
        }
    }
    
    private async Task DeleteFormBLongResearchEquipments(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBLongResearchEquipment in formB.FormBLongResearchEquipments)
        {
            var researchEquipment = formBLongResearchEquipment.ResearchEquipment;
            formBLongResearchEquipmentsRepository.Delete(formBLongResearchEquipment);

            if (await researchEquipmentsRepository.CountFormCAssociations(researchEquipment, cancellationToken) == 0 && 
                await researchEquipmentsRepository.CountUniqueFormsB(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
            }
        }
    }

    private async Task DeletePorts(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBPort in formB.FormBPorts)
        {
            var port = formBPort.Port;
            formBPortsRepository.Delete(formBPort);

            if (await portsRepository.CountFormCPorts(port, cancellationToken) == 0 && 
                await portsRepository.CountUniqueFormsB(port, cancellationToken) == 1) // The one to be deleted
            {
                portsRepository.Delete(port);
            }
        }
    }

    private async Task DeleteCruiseDaysDetails(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var cruiseDayDetails in formB.CruiseDaysDetails)
        {
            if (await cruiseDaysDetailsRepository.CountUniqueFormsC(cruiseDayDetails, cancellationToken) == 0 &&
                await cruiseDaysDetailsRepository.CountUniqueFormsB(cruiseDayDetails, cancellationToken) == 1) // The one to be deleted
            {
                cruiseDaysDetailsRepository.Delete(cruiseDayDetails);
            }
        }
        
        formB.CruiseDaysDetails.Clear();
    }
    
    private async Task DeleteFormBResearchEquipments(FormB formB, CancellationToken cancellationToken)
    {
        foreach (var formBResearchEquipment in formB.FormBResearchEquipments)
        {
            var researchEquipment = formBResearchEquipment.ResearchEquipment;
            formBResearchEquipmentsRepository.Delete(formBResearchEquipment);

            if (await researchEquipmentsRepository.CountFormCAssociations(researchEquipment, cancellationToken) == 0 &&
                await researchEquipmentsRepository.CountUniqueFormsB(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
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
            if (await permissionsRepository.CountFormsA(permission, cancellationToken) == 0 &&
                await permissionsRepository.CountFormsB(permission, cancellationToken) == 0 &&
                await permissionsRepository.CountFormsC(permission, cancellationToken) == 1) // The one to be deleted
            {
                permissionsRepository.Delete(permission);
            }
        }
        
        formC.Permissions.Clear();
    }
    
    private void DeleteFormCUgUnits(FormC formC)
    {
        foreach (var formCUgUnit in formC.FormCUgUnits)
        {
            formCUgUnitsRepository.Delete(formCUgUnit);
        }
    }
    
    private async Task DeleteFormCGuestUnits(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCGuestUnit in formC.FormCGuestUnits)
        {
            var guestUnit = formCGuestUnit.GuestUnit;
            formCGuestUnitsRepository.Delete(formCGuestUnit);
            
            if (await guestUnitsRepository.CountFormAGuestUnits(guestUnit, cancellationToken) == 0 &&
                await guestUnitsRepository.CountFormBGuestUnits(guestUnit, cancellationToken) == 0 &&
                await guestUnitsRepository.CountUniqueFormsC(guestUnit, cancellationToken) == 1) // The one to be deleted
            {
                guestUnitsRepository.Delete(guestUnit);
            }
        }
    }

    private async Task DeleteContracts(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var contract in formC.Contracts)
        {
            if (await contractsRepository.CountFormAContracts(contract, cancellationToken) == 0 &&
                await contractsRepository.CountDistinctFormsC(contract, cancellationToken) == 1) // The one to be deleted
            {
                contractsRepository.Delete(contract);
            }
        }
        
        formC.Contracts.Clear();
    }
    
    private async Task DeleteSpubTasks(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var spubTask in formC.SpubTasks)
        {
            if (await spubTasksRepository.CountFormASpubTasks(spubTask, cancellationToken) == 0 &&
                await spubTasksRepository.CountUniqueFormsC(spubTask, cancellationToken) == 1) // The one to be deleted
            {
                spubTasksRepository.Delete(spubTask);
            }
        }
        
        formC.SpubTasks.Clear();
    }
    
    private async Task DeleteFormCShortResearchEquipments(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCShortResearchEquipment in formC.FormCShortResearchEquipments)
        {
            var researchEquipment = formCShortResearchEquipment.ResearchEquipment;
            formCShortResearchEquipmentsRepository.Delete(formCShortResearchEquipment);

            if (await researchEquipmentsRepository.CountFormBAssociations(researchEquipment, cancellationToken) == 0 && 
                await researchEquipmentsRepository.CountUniqueFormsC(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
            }
        }
    }
    
    private async Task DeleteFormCLongResearchEquipments(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCLongResearchEquipment in formC.FormCLongResearchEquipments)
        {
            var researchEquipment = formCLongResearchEquipment.ResearchEquipment;
            formCLongResearchEquipmentsRepository.Delete(formCLongResearchEquipment);

            if (await researchEquipmentsRepository.CountFormBAssociations(researchEquipment, cancellationToken) == 0 && 
                await researchEquipmentsRepository.CountUniqueFormsC(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
            }
        }
    }
    
    private async Task DeletePorts(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCPort in formC.FormCPorts)
        {
            var port = formCPort.Port;
            formCPortsRepository.Delete(formCPort);

            if (await portsRepository.CountFormBPorts(port, cancellationToken) == 0 && 
                await portsRepository.CountUniqueFormsC(port, cancellationToken) == 1) // The one to be deleted
            {
                portsRepository.Delete(port);
            }
        }
    }
    
    private async Task DeleteCruiseDaysDetails(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var cruiseDayDetails in formC.CruiseDaysDetails)
        {
            if (await cruiseDaysDetailsRepository.CountUniqueFormsB(cruiseDayDetails, cancellationToken) == 0 &&
                await cruiseDaysDetailsRepository.CountUniqueFormsC(cruiseDayDetails, cancellationToken) == 1) // The one to be deleted
            {
                cruiseDaysDetailsRepository.Delete(cruiseDayDetails);
            }
        }
        
        formC.CruiseDaysDetails.Clear();
    }
    
    private async Task DeleteFormCResearchEquipments(FormC formC, CancellationToken cancellationToken)
    {
        foreach (var formCResearchEquipment in formC.FormCResearchEquipments)
        {
            var researchEquipment = formCResearchEquipment.ResearchEquipment;
            formCResearchEquipmentsRepository.Delete(formCResearchEquipment);

            if (await researchEquipmentsRepository.CountFormBAssociations(researchEquipment, cancellationToken) == 0 &&
                await researchEquipmentsRepository.CountUniqueFormsC(researchEquipment, cancellationToken) == 1) // The one to be deleted
            {
                researchEquipmentsRepository.Delete(researchEquipment);
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
            collectedSamplesRepository.Delete(collectedSample);
        }
        
        formC.CollectedSamples.Clear();
    }
    
    private void DeletePhotos(FormC formC)
    {
        foreach (var photo in formC.Photos)
        {
            photosRepository.Delete(photo);
        }
        
        formC.Photos.Clear();
    }
}