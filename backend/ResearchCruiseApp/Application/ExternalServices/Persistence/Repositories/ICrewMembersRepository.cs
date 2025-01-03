using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface ICrewMembersRepository : IRepository<CrewMember>
{
    Task<int> CountUniqueFormsB(CrewMember crewMember, CancellationToken cancellationToken);
}
