using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class CrewMembersRepository : Repository<CrewMember>, ICrewMembersRepository
{
    public CrewMembersRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<int> CountUniqueFormsB(CrewMember crewMember, CancellationToken cancellationToken)
    {
        return DbContext.CrewMembers
            .Where(c => c.Id == crewMember.Id)
            .SelectMany(c => c.FormsB)
            .Select(f => f.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}