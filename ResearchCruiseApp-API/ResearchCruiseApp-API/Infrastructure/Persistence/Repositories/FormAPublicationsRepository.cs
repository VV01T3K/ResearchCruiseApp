using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormAPublicationsRepository : Repository<FormAPublication>, IFormAPublicationsRepository
{
    public FormAPublicationsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}