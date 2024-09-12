using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruisesRepository : Repository<Cruise>, ICruisesRepository
{
    public CruisesRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<Cruise?> GetByIdWithCruiseApplications(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => cruise.Id == id)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public Task<List<Cruise>> GetAllWithCruiseApplications(CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Cruise>> GetByCruiseApplicationsIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => ids.Any(id =>
                cruise.CruiseApplications
                    .Select(cruiseApplication => cruiseApplication.Id)
                    .Contains(id)))
            .ToListAsync(cancellationToken);
    }

    public void Delete(Cruise cruise)
    {
        DbContext.Cruises.Remove(cruise);
    }
}