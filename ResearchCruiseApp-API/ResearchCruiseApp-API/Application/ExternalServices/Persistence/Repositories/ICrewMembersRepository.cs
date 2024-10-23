using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICrewMembersRepository : IRepository<CrewMember>
{
    Task<int> CountUniqueFormsB(CrewMember crewMember, CancellationToken cancellationToken);
}