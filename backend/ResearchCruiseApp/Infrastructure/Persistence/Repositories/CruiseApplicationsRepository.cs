using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class CruiseApplicationsRepository
    : Repository<CruiseApplication>,
        ICruiseApplicationsRepository
{
    public CruiseApplicationsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public Task<List<CruiseApplication>> GetAllWithFormsAndFormAContent(
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetKeysetPageWithFormsAndFormAContentAndEffects(
        string sortBy,
        bool descending,
        string? cursorSortValue,
        Guid? cursorId,
        int pageSize,
        CruiseApplicationsFilter filter,
        CancellationToken cancellationToken
    )
    {
        var query = DbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeEffects()
            .IncludeCruise()
            .ApplyFilter(filter, DbContext.Users);

        var cursor = cursorSortValue is not null && cursorId is not null ? cursorSortValue : null;
        query = sortBy switch
        {
            "date" => query.ApplyDateSort(cursor, cursorId, descending),
            "year" => query.ApplyYearSort(cursor, cursorId, descending),
            _ => query.ApplyNumberSort(cursor, cursorId, descending),
        };

        return query.Take(pageSize).ToListAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetAllWithFormA(CancellationToken cancellationToken)
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .Where(cruiseApplication => cruiseApplication.FormA != null)
            .ToListAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormA(Guid id, CancellationToken cancellationToken)
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task LoadFormA(CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        return DbContext
            .Entry(cruiseApplication)
            .Reference(applicationEntry => applicationEntry.FormA)
            .LoadAsync(cancellationToken);
    }

    public Task<CruiseApplication?> GetByIdWithFormAContent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormB(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormB()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<CruiseApplication?> GetByIdWithForms(Guid id, CancellationToken cancellationToken)
    {
        return DbContext
            .CruiseApplications.IncludeForms()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<CruiseApplication?> GetByIdWithFormsAndFormAContent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormBContent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<CruiseApplication?> GetByIdWithFormAAndFormCContent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormC()
            .IncludeFormCContent()
            .AsSplitQuery()
            .SingleOrDefaultAsync(
                cruiseApplication => cruiseApplication.Id == id,
                cancellationToken
            );
    }

    public Task<List<CruiseApplication>> GetAllByIds(
        List<Guid> ids,
        CancellationToken cancellationToken
    )
    {
        if (ids.Count == 0)
            return Task.FromResult(new List<CruiseApplication>());

        return DbContext
            .CruiseApplications.Where(cruiseApplication => ids.Contains(cruiseApplication.Id))
            .ToListAsync(cancellationToken);
    }

    public Task<List<CruiseApplication>> GetAllByUserIdWithFormA(
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormAContent()
            .Where(cruiseApplication =>
                cruiseApplication.FormA!.CruiseManagerId == userId
                || cruiseApplication.FormA.DeputyManagerId == userId
            )
            .ToListAsync(cancellationToken);
    }
}
