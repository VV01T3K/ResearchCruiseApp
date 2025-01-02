using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class PublicationsRepository : Repository<Publication>, IPublicationsRepository
{
    public PublicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<int> CountUserPublications(Publication publication, CancellationToken cancellationToken)
    {
        return DbContext.Publications
            .Where(p => p.Id == publication.Id)
            .SelectMany(p => p.UserPublications)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsA(Publication publication, CancellationToken cancellationToken)
    {
        return DbContext.Publications
            .Where(p => p.Id == publication.Id)
            .SelectMany(p => p.FormAPublications)
            .Select(fp => fp.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }

    public Task<int> CountFormAPublications(Publication publication, CancellationToken cancellationToken)
    {
        return DbContext.Publications
            .Where(p => p.Id == publication.Id)
            .SelectMany(p => p.FormAPublications)
            .CountAsync(cancellationToken);
    }
}