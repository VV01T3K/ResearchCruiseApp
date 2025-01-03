using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.Interfaces;
using ResearchCruiseApp.Application.Services.Factories.Contracts;
using ResearchCruiseApp.Application.Services.Factories.Permissions;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.FormsFieldsService;

public class FormsFieldsService(
    IMapper mapper,
    IPermissionsRepository permissionsRepository,
    IResearchTasksRepository researchTasksRepository,
    IContractsRepository contractsRepository,
    IGuestUnitsRepository guestUnitsRepository,
    IPublicationsRepository publicationsRepository,
    ISpubTasksRepository spubTasksRepository,
    ICrewMembersRepository crewMembersRepository,
    IResearchEquipmentsRepository researchEquipmentsRepository,
    IPortsRepository portsRepository,
    ICruiseDaysDetailsRepository cruiseDaysDetailsRepository,
    IPermissionsFactory permissionsFactory,
    IContractsFactory contractsFactory
) : IFormsFieldsService
{
    public async Task<Permission> GetUniquePermission(
        PermissionDto permissionDto,
        IEnumerable<Permission> permissionsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPermission = await permissionsFactory.Create(permissionDto);
        var oldPermission =
            Find(newPermission, permissionsInMemory)
            ?? await permissionsRepository.Get(newPermission, cancellationToken);

        return oldPermission ?? newPermission;
    }

    public async Task<ResearchTask> GetUniqueResearchTask(
        IResearchTaskDto researchTaskDto,
        IEnumerable<ResearchTask> researchTasksInMemory,
        CancellationToken cancellationToken
    )
    {
        var newResearchTask = mapper.Map<ResearchTask>(researchTaskDto);
        var oldResearchTask =
            Find(newResearchTask, researchTasksInMemory)
            ?? await researchTasksRepository.Get(newResearchTask, cancellationToken);

        return oldResearchTask ?? newResearchTask;
    }

    public async Task<Contract> GetUniqueContract(
        ContractDto contractDto,
        IEnumerable<Contract> contractsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newContract = await contractsFactory.Create(contractDto);
        var oldContract =
            Find(newContract, contractsInMemory)
            ?? await contractsRepository.Get(newContract, cancellationToken);

        return oldContract ?? newContract;
    }

    public async Task<Publication> GetUniquePublication(
        PublicationDto publicationDto,
        IEnumerable<Publication> publicationInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPublication = mapper.Map<Publication>(publicationDto);
        var oldPublication =
            Find(newPublication, publicationInMemory)
            ?? await publicationsRepository.Get(newPublication, cancellationToken);

        return oldPublication ?? newPublication;
    }

    public async Task<SpubTask> GetUniqueSpubTask(
        SpubTaskDto spubTaskDto,
        IEnumerable<SpubTask> spubTasksInMemory,
        CancellationToken cancellationToken
    )
    {
        var newSpubTask = mapper.Map<SpubTask>(spubTaskDto);
        var oldSpubTask =
            Find(newSpubTask, spubTasksInMemory)
            ?? await spubTasksRepository.Get(newSpubTask, cancellationToken);

        return oldSpubTask ?? newSpubTask;
    }

    public async Task<GuestUnit> GetUniqueGuestUnit(
        GuestTeamDto guestTeamDto,
        IEnumerable<GuestUnit> guestUnitsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newGuestUnit = mapper.Map<GuestUnit>(guestTeamDto);
        var oldGuestUnit =
            Find(newGuestUnit, guestUnitsInMemory)
            ?? await guestUnitsRepository.Get(newGuestUnit, cancellationToken);

        return oldGuestUnit ?? newGuestUnit;
    }

    public async Task<CrewMember> GetUniqueCrewMember(
        CrewMemberDto crewMemberDto,
        IEnumerable<CrewMember> crewMembersInMemory,
        CancellationToken cancellationToken
    )
    {
        var newCrewMember = mapper.Map<CrewMember>(crewMemberDto);
        var oldCrewMember =
            Find(newCrewMember, crewMembersInMemory)
            ?? await crewMembersRepository.Get(newCrewMember, cancellationToken);

        return oldCrewMember ?? newCrewMember;
    }

    public async Task<ResearchEquipment> GetUniqueResearchEquipment(
        IResearchEquipmentDto researchEquipmentDto,
        IEnumerable<ResearchEquipment> researchEquipmentsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newResearchEquipment = mapper.Map<ResearchEquipment>(researchEquipmentDto);
        var oldResearchEquipment =
            Find(newResearchEquipment, researchEquipmentsInMemory)
            ?? await researchEquipmentsRepository.Get(newResearchEquipment, cancellationToken);

        return oldResearchEquipment ?? newResearchEquipment;
    }

    public async Task<Port> GetUniquePort(
        PortDto portDto,
        IEnumerable<Port> portsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPort = mapper.Map<Port>(portDto);
        var oldPort =
            Find(newPort, portsInMemory) ?? await portsRepository.Get(newPort, cancellationToken);

        return oldPort ?? newPort;
    }

    public async Task<CruiseDayDetails> GetUniqueCruiseDayDetails(
        CruiseDayDetailsDto cruiseDayDetailsDto,
        IEnumerable<CruiseDayDetails> cruiseDaysDetailsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newCruiseDayDetails = mapper.Map<CruiseDayDetails>(cruiseDayDetailsDto);
        var oldCruiseDayDetails =
            Find(newCruiseDayDetails, cruiseDaysDetailsInMemory)
            ?? await cruiseDaysDetailsRepository.Get(newCruiseDayDetails, cancellationToken);

        return oldCruiseDayDetails ?? newCruiseDayDetails;
    }

    private static T? Find<T>(T searchedObject, IEnumerable<T> collection)
        where T : Entity, IEquatable<T>
    {
        return collection.FirstOrDefault(element => element.Equals(searchedObject));
    }
}
