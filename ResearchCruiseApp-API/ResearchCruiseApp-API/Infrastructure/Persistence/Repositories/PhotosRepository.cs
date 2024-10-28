using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class PhotosRepository : Repository<Photo>, IPhotosRepository
{
    public PhotosRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}