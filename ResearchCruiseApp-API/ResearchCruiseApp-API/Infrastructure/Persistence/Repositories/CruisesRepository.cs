using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruisesRepository : Repository<Cruise>, ICruisesRepository
{
    public CruisesRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<Cruise?> GetByIdWithCruiseApplications(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .IncludeCruiseApplications()
            .SingleOrDefaultAsync(cruise => cruise.Id == id, cancellationToken);
    }
    
    public Task<Cruise?> GetByIdWithCruiseApplicationsWithForm(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => cruise.Id == id)
            .Include(cruise=>cruise.CruiseApplications)
            .ThenInclude(cruiseApplication=>cruiseApplication.FormA)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public Task<List<Cruise>> GetAllWithCruiseApplications(CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .IncludeCruiseApplications()
            .ToListAsync(cancellationToken);
    }

    public Task<List<Cruise>> GetAllWithCruiseApplicationsWithFormAContent(CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.Permissions)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormAResearchTasks)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormAContracts)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormAUgUnits)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormAGuestUnits)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormAPublications)
            .IncludeCruiseApplications()
            .ThenInclude(cruiseApplication => cruiseApplication.FormA!.FormASpubTasks)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Cruise>> GetByCruiseApplicationsIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.Cruises
            .IncludeCruiseApplications()
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