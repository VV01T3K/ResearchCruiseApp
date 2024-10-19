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


    public Task<List<CruiseApplication>> GetAllWithFormsAndFormAContent(CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormA(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormB(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormB()
            .IncludeCruise()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithForms(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeForms()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public Task<CruiseApplication?> GetByIdWithFormsAndFormAContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeForms()
            .IncludeFormAContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormBContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormCContent(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormC()
            .IncludeFormCContent()
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormsAndResearchTasks(Guid id, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeForms()
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAResearchTasks)
            .ThenInclude(formAResearchTask => formAResearchTask.ResearchTask)
            .SingleOrDefaultAsync(cruiseApplication => cruiseApplication.Id == id, cancellationToken);
    }
    
    public Task<List<CruiseApplication>> GetAllByIds(List<Guid> ids, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .Where(cruiseApplication => ids.Contains(cruiseApplication.Id))
            .ToListAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetAllByUserIdWithFormA(Guid userId, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormAContent()
            .Where(cruiseApplication =>
                cruiseApplication.FormA!.CruiseManagerId == userId ||
                cruiseApplication.FormA.DeputyManagerId == userId)
            .ToListAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetAllByUserIdWithFormAAndFormCContent(
        Guid userId, CancellationToken cancellationToken)
    {
        return DbContext.CruiseApplications
            .IncludeFormA()
            .IncludeFormC()
            .IncludeFormCContent()
            .Where(cruiseApplication =>
                cruiseApplication.FormA!.CruiseManagerId == userId ||
                cruiseApplication.FormA.DeputyManagerId == userId)
            .ToListAsync(cancellationToken);
    }
}