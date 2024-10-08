using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CrewMembersRepository : Repository<CrewMember>, ICrewMembersRepository
{
    public CrewMembersRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}