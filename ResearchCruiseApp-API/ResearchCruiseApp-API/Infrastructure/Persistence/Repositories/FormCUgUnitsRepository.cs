using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCUgUnitsRepository : Repository<FormCUgUnit>, IFormCUgUnitsRepository
{
    public FormCUgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}