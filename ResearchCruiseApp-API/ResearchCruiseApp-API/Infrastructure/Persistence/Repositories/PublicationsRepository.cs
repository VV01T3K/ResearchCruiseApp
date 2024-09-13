using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class PublicationsRepository : Repository<Publication>, IPublicationsRepository
{
    public PublicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}