using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class PhotosRepository : Repository<Photo>, IPhotosRepository
{
    public PhotosRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}