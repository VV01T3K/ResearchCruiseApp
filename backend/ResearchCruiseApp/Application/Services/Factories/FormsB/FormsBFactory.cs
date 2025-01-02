using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsB;


public class FormsBFactory(
    IMapper mapper,
    IUgUnitsRepository ugUnitsRepository,
    IShipEquipmentsRepository shipEquipmentsRepository,
    IFormsFieldsService formsFieldsService)
    : IFormsBFactory
{
    public async Task<FormB> Create(FormBDto formBDto, CancellationToken cancellationToken)
    {
        var formB = mapper.Map<FormB>(formBDto);

        await AddPermissions(formB, formBDto, cancellationToken);
        await AddFormBUgUnits(formB, formBDto, cancellationToken);
        await AddFormBGuestUnits(formB, formBDto, cancellationToken);
        await AddCrewMembers(formB, formBDto, cancellationToken);
        await AddFormBPorts(formB, formBDto, cancellationToken);
        await AddCruiseDaysDetails(formB, formBDto, cancellationToken);
        await AddShipEquipments(formB, formBDto, cancellationToken);
        
        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await AddFormBShortResearchEquipments(formB, formBDto, alreadyAddedResearchEquipments, cancellationToken);
        await AddFormBLongResearchEquipments(formB, formBDto, alreadyAddedResearchEquipments, cancellationToken);
        await AddFormBResearchEquipments(formB, formBDto, alreadyAddedResearchEquipments, cancellationToken);
        
        return formB;
    }


    private async Task AddPermissions(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionDto in formBDto.Permissions)
        {
            var permission = await formsFieldsService
                .GetUniquePermission(permissionDto, alreadyAddedPermissions, cancellationToken);
            alreadyAddedPermissions.Add(permission);

            formB.Permissions.Add(permission);
        }
    }
    
    private async Task AddFormBUgUnits(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        foreach (var ugTeamDto in formBDto.UgTeams)
        {
            var ugUnit = await ugUnitsRepository.GetById(ugTeamDto.UgUnitId, cancellationToken);
            if (ugUnit is null)
                continue;

            var formBUgUnit = new FormBUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamDto.NoOfEmployees,
                NoOfStudents = ugTeamDto.NoOfStudents
            };
            formB.FormBUgUnits.Add(formBUgUnit);
        }
    }
    
    private async Task AddFormBGuestUnits(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();
        
        foreach (var guestTeamDto in formBDto.GuestTeams)
        {
            var guestUnit = await formsFieldsService
                .GetUniqueGuestUnit(guestTeamDto, alreadyAddedGuestUnits, cancellationToken);
            alreadyAddedGuestUnits.Add(guestUnit);

            var formBGuestUnit = new FormBGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamDto.NoOfPersons
            };
            formB.FormBGuestUnits.Add(formBGuestUnit);
        }
    }

    private async Task AddCrewMembers(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        var alreadyAddedCrewMembers = new HashSet<CrewMember>();
        
        foreach (var crewMemberDto in formBDto.CrewMembers)
        {
            var crewMember = await formsFieldsService
                .GetUniqueCrewMember(crewMemberDto, alreadyAddedCrewMembers, cancellationToken);
            alreadyAddedCrewMembers.Add(crewMember);
            
            formB.CrewMembers.Add(crewMember);
        }
    }

    private async Task AddFormBShortResearchEquipments(
        FormB formB,
        FormBDto formBDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken)
    {
        foreach (var shortResearchEquipmentDto in formBDto.ShortResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                shortResearchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken);
            alreadyAddedResearchEquipments.Add(researchEquipment);
            
            var formBShortResearchEquipment = new FormBShortResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                StartDate = shortResearchEquipmentDto.StartDate,
                EndDate = shortResearchEquipmentDto.EndDate
            };
            formB.FormBShortResearchEquipments.Add(formBShortResearchEquipment);
        }
    }

    private async Task AddFormBLongResearchEquipments(
        FormB formB,
        FormBDto formBDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken)
    {
        foreach (var longResearchEquipmentDto in formBDto.LongResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                longResearchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken);
            alreadyAddedResearchEquipments.Add(researchEquipment);
            
            var formBLongResearchEquipment = new FormBLongResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                Action = longResearchEquipmentDto.Action.ToEnum<ResearchEquipmentAction>(),
                Duration = longResearchEquipmentDto.Duration
            };
            formB.FormBLongResearchEquipments.Add(formBLongResearchEquipment);
        }
    }

    private async Task AddFormBPorts(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        var alreadyAddedPorts = new HashSet<Port>();
        
        foreach (var portDto in formBDto.Ports)
        {
            var port = await formsFieldsService.GetUniquePort(portDto, alreadyAddedPorts, cancellationToken);
            alreadyAddedPorts.Add(port);
            
            var formBPort = new FormBPort
            {
                Port = port,
                StartTime = portDto.StartTime,
                EndTime = portDto.EndTime
            };
            formB.FormBPorts.Add(formBPort);
        }
    }

    private async Task AddCruiseDaysDetails(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        var alreadyAddedCruiseDaysDetails = new HashSet<CruiseDayDetails>();
        
        foreach (var cruiseDayDetailsDto in formBDto.CruiseDaysDetails)
        {
            var cruiseDayDetails = await formsFieldsService
                .GetUniqueCruiseDayDetails(cruiseDayDetailsDto, alreadyAddedCruiseDaysDetails, cancellationToken);
            alreadyAddedCruiseDaysDetails.Add(cruiseDayDetails);
            
            formB.CruiseDaysDetails.Add(cruiseDayDetails);
        }
    }
    
    private async Task AddFormBResearchEquipments(
        FormB formB,
        FormBDto formBDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken)
    {
        foreach (var researchEquipmentDto in formBDto.ResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                researchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken);
            alreadyAddedResearchEquipments.Add(researchEquipment);
            
            var formBResearchEquipment = new FormBResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                InsuranceStartDate = researchEquipmentDto.InsuranceStartDate,
                InsuranceEndDate = researchEquipmentDto.InsuranceEndDate,
                Permission = researchEquipmentDto.Permission
            };
            formB.FormBResearchEquipments.Add(formBResearchEquipment);
        }
    }

    private async Task AddShipEquipments(FormB formB, FormBDto formBDto, CancellationToken cancellationToken)
    {
        foreach (var shipEquipmentId in formBDto.ShipEquipmentsIds)
        {
            var shipEquipment = await shipEquipmentsRepository.GetById(shipEquipmentId, cancellationToken);
            if (shipEquipment is null)
                continue;
            
            formB.ShipEquipments.Add(shipEquipment);
        }
    }
}