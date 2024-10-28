using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCPortsRepository : Repository<FormCPort>, IFormCPortsRepository
{
    public FormCPortsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}