using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;

internal class UserPublicationsRepository : Repository<UserPublication>, IUserPublicationsRepository
{
    public UserPublicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }

    public Task<List<UserPublication>> GetAllByUserId(Guid userId, CancellationToken cancellationToken)
    {
        return DbContext.UserPublications
            .Include(userPublication => userPublication.Publication)
            .Where(publication => publication.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public Task<UserPublication?> GetPublicationByUserIdAndPublicationId(Guid userId, Guid publicationId,
        CancellationToken cancellationToken)
    {
        return DbContext.UserPublications
            .Include(userPublication => userPublication.Publication)
            .Where(publication => publication.UserId == userId)
            .FirstOrDefaultAsync(publication => publication.Publication.Id == publicationId, cancellationToken);
    }


    public Task<bool> CheckIfExists(Publication publication)
    {
        return DbContext.UserPublications
            .Include(userPublication => userPublication.Publication)
            .AnyAsync(userPublication => userPublication.Publication.Equals(publication));
    }
}