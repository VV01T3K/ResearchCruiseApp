using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruiseApplicationsRepository : Repository<CruiseApplication>, ICruiseApplicationsRepository
{
    public CruiseApplicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<List<CruiseApplication>> GetAll(CancellationToken cancellationToken)
    {
        return GetCruiseApplicationsQuery().ToListAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetById(Guid id, CancellationToken cancellationToken)
    {
        return GetCruiseApplicationsQuery()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .IncludeFormAContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public async Task Add(CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        await DbContext.CruiseApplications.AddAsync(cruiseApplication, cancellationToken);
    }
    
    public Task<List<CruiseApplication>> GetManyByIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Where(cruiseApplication => ids.Contains(cruiseApplication.Id))
            .ToListAsync(cancellationToken);
    }
    
    public Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .IncludeFormAContent()
            .Where(cruiseApplication => cruiseApplication.Id == id)
            .Select(cruiseApplication => cruiseApplication.FormA)
            .SingleOrDefaultAsync(cancellationToken);
    }


    private IIncludableQueryable<CruiseApplication, FormC?> GetCruiseApplicationsQuery()
    {
        return DbContext.CruiseApplications
            .AsQueryable()
            .IncludeForms();
    }
}