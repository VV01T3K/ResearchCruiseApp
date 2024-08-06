using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruiseApplicationsRepository : Repository<CruiseApplication>, ICruiseApplicationsRepository
{
    public CruiseApplicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<List<CruiseApplication>> GetAllCruiseApplications(CancellationToken cancellationToken)
    {
        return GetCruiseApplicationsQuery().ToListAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetCruiseApplicationById(Guid id, CancellationToken cancellationToken)
    {
        return GetCruiseApplicationsQuery()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public async Task AddCruiseApplication(CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        await DbContext.CruiseApplications.AddAsync(cruiseApplication, cancellationToken);
    }
    
    public Task<List<CruiseApplication>> GetCruiseApplicationsByIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Where(cruiseApplication => ids.Contains(cruiseApplication.Id))
            .ToListAsync(cancellationToken);
    }
    
    public Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Where(cruiseApplication => cruiseApplication.Id == id)
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.Contracts)
            .Include(cruiseApplication => cruiseApplication.FormA!.Publications)
            .Include(cruiseApplication => cruiseApplication.FormA!.Theses)
            .Include(cruiseApplication => cruiseApplication.FormA!.GuestTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchTasks)
            .Include(cruiseApplication => cruiseApplication.FormA!.UgTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.SpubTasks)
            .Select(cruiseApplication => cruiseApplication.FormA)
            .SingleOrDefaultAsync(cancellationToken);
    }


    private IIncludableQueryable<CruiseApplication, FormC?> GetCruiseApplicationsQuery()
    {
        return DbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .Include(cruiseApplication => cruiseApplication.FormB)
            .Include(cruiseApplication => cruiseApplication.FormC);
    }
}