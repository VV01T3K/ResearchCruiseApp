using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruiseApplicationsRepository : Repository<CruiseApplication>, ICruiseApplicationsRepository
{
    private IQueryable<CruiseApplication> CruiseApplicationsQuery => DbContext.CruiseApplications.AsQueryable();
    
    
    public CruiseApplicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<List<CruiseApplication>> GetAllWithFormsAndFormAContent(CancellationToken cancellationToken)
    {
        return CruiseApplicationsQuery
            .IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormA(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Include(cruiseApplication => cruiseApplication.FormA)
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public Task<CruiseApplication?> GetByIdWithFormsAndFormAContent(Guid id, CancellationToken cancellationToken)
    {
        return CruiseApplicationsQuery
            .IncludeForms()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public Task<List<CruiseApplication>> GetAllByIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Where(cruiseApplication => ids.Contains(cruiseApplication.Id))
            .ToListAsync(cancellationToken);
    }
    
    public Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormAContent()
            .Where(cruiseApplication => cruiseApplication.Id == id)
            .Select(cruiseApplication => cruiseApplication.FormA)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetAllByUserIdWithFormA(Guid userId, CancellationToken cancellationToken)
    {
        return CruiseApplicationsQuery
            .IncludeFormA()
            .IncludeFormAContent()
            .Where(cruiseApplication =>
                cruiseApplication.FormA!.CruiseManagerId == userId ||
                cruiseApplication.FormA.DeputyManagerId == userId)
            .ToListAsync(cancellationToken);
    }
}