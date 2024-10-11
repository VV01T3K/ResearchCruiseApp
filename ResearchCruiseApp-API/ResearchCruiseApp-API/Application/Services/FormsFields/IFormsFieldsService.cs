using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.FormsFields;


public interface IFormsFieldsService
{
    Task<ResearchTask> GetUniqueResearchTask(
        IResearchTaskDto researchTaskDto,
        IEnumerable<ResearchTask> researchTasksInMemory,
        CancellationToken cancellationToken);
    
    Task<GuestUnit> GetUniqueGuestUnit(
        GuestTeamDto guestTeamDto, IEnumerable<GuestUnit> guestUnitsInMemory, CancellationToken cancellationToken);

    Task<Contract> GetUniqueContract(
        ContractDto contractDto, IEnumerable<Contract> contractsInMemory, CancellationToken cancellationToken);
    
    Task<SpubTask> GetUniqueSpubTask(
        SpubTaskDto spubTaskDto, IEnumerable<SpubTask> spubTasksInMemory, CancellationToken cancellationToken);
    
    Task<CrewMember> GetUniqueCrewMember(
        CrewMemberDto crewMemberDto, IEnumerable<CrewMember> crewMembersInMemory, CancellationToken cancellationToken);
    
    Task<ResearchEquipment> GetUniqueResearchEquipment(
        IResearchEquipmentDto researchEquipmentDto,
        IEnumerable<ResearchEquipment> researchEquipmentsInMemory,
        CancellationToken cancellationToken);
    
    Task<Port> GetUniquePort(PortDto portDto, IEnumerable<Port> portsInMemory, CancellationToken cancellationToken);
    
    Task<CruiseDayDetails> GetUniqueCruiseDayDetails(
        CruiseDayDetailsDto cruiseDayDetailsDto,
        IEnumerable<CruiseDayDetails> cruiseDayDetailsInMemory,
        CancellationToken cancellationToken);
}