using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class PublicationsRepository : Repository<Publication>, IPublicationsRepository
{
    public PublicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }

    public Task<int> CountFormAPublications(Publication publication, CancellationToken cancellationToken)
    {
        return DbContext.Publications
            .Where(p => p.Id == publication.Id)
            .SelectMany(p => p.FormAPublications)
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountUserPublications(Publication publication, CancellationToken cancellationToken)
    {
        return DbContext.Publications
            .Where(p => p.Id == publication.Id)
            .SelectMany(p => p.UserPublications)
            .CountAsync(cancellationToken);
    }
}